"use client";
import { Children, createContext, isValidElement, ReactNode, useCallback, useContext, useState, useMemo } from "react";

/**
 * A single view/step within a Survey.
 * 
 * @example
 * <SurveyView id="personal-info">
 *   <PersonalInfoForm />
 * </SurveyView>
 */
export function SurveyView({ id, children }: { id: string; children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Renders the current view in the survey flow.
 * Must be used within a Survey component.
 * 
 * @throws Error if not used within a Survey
 */
export function SurveyViewProxy() {
  const { CurrentView } = useSurveyContext();
  return <CurrentView />;
}

/**
 * Props for the Survey component
 */
type SurveyProps = {
  /** Child elements - should include SurveyView and control components */
  children: ReactNode;
  /** Initial view index (default: 0) */
  defaultViewIndex?: number;
  /** Callback when user navigates backwards from first view */
  onCancel?: () => void;
  /** Callback when user navigates forwards from last view */
  onSubmit?: () => void;
  // TODO: implement controlled mode later
  // viewIndex?: number;
  // onViewIndexChange?: (index: number) => void;
};

/**
 * Multi-view form/survey container with navigation state management.
 * 
 * @example
 * <Survey onSubmit={handleComplete} onCancel={handleCancel}>
 *   <SurveyView id="step-1">
 *     <FirstStepContent />
 *   </SurveyView>
 *   <SurveyView id="step-2">
 *     <SecondStepContent />
 *   </SurveyView>
 *   <NavigationControls />
 * </Survey>
 */
export function Survey({ children, defaultViewIndex = 0, onCancel, onSubmit }: SurveyProps) {
  const [index, setIndex] = useState(defaultViewIndex);
  const surveyChildren = Children.toArray(children).filter(surveyFilter);
  const restChildren = Children.toArray(children).filter(child => !surveyFilter(child));
  
  // Validate that at least one SurveyView exists
  if (surveyChildren.length === 0) {
    console.warn("Survey: No SurveyView components found. Add at least one SurveyView as a child.");
  }

  const CurrentView = () => <>{surveyChildren[index]}</> || null;
  const totalViews = surveyChildren.length;
  const currentViewId = surveyChildId(surveyChildren[index]);
  const nextViewId = surveyChildId(surveyChildren[index + 1]);
  const prevViewId = surveyChildId(surveyChildren[index - 1]);
  const isFirstView = index === 0;
  const isLastView = index >= totalViews - 1;

  const onNextView = useCallback(() => {
    if (isLastView) {
      onSubmit?.();
    } else {
      setIndex(index + 1);
    }
  }, [index, isLastView, onSubmit]);

  const onPrevView = useCallback(() => {
    if (isFirstView) {
      onCancel?.();
    } else {
      setIndex(index - 1);
    }
  }, [index, isFirstView, onCancel]);

  const contextValue = useMemo(
    () => ({
      CurrentView,
      onNextView,
      onPrevView,
      currentViewId,
      nextViewId,
      prevViewId,
      currentIndex: index,
      totalViews,
      isFirstView,
      isLastView,
    }),
    [CurrentView, onNextView, onPrevView, currentViewId, nextViewId, prevViewId, index, totalViews, isFirstView, isLastView]
  );

  return (
    <SurveyContext.Provider value={contextValue}>
      {restChildren}
    </SurveyContext.Provider>
  );
}

/**
 * Safely extracts the id prop from a SurveyView child element
 */
const surveyChildId = (child: ReactNode): string | null => {
  if (isValidElement(child)) {
    return (child.props?.id as string) || null;
  }
  return null;
};

/**
 * Filters for valid SurveyView components
 */
const surveyFilter = (child: ReactNode): boolean => {
  if (isValidElement(child)) {
    return child.type === SurveyView;
  }
  return false;
};

/**
 * Context type for Survey state and navigation
 */
type SurveyContextType = {
  /** Function that renders the current view */
  CurrentView: () => ReactNode;
  /** Navigate to next view or call onSubmit if on last view */
  onNextView: () => void;
  /** Navigate to previous view or call onCancel if on first view */
  onPrevView: () => void;
  /** ID of the current view */
  currentViewId: string | null;
  /** ID of the next view (null if on last view) */
  nextViewId: string | null;
  /** ID of the previous view (null if on first view) */
  prevViewId: string | null;
  /** Current view index (0-based) */
  currentIndex: number;
  /** Total number of views */
  totalViews: number;
  /** Whether currently on first view */
  isFirstView: boolean;
  /** Whether currently on last view */
  isLastView: boolean;
};

const SurveyContext = createContext<SurveyContextType | null>(null);

/**
 * Hook to access survey state and navigation from within Survey children
 * 
 * @throws Error if not used within a Survey component
 * @example
 * function NavigationButtons() {
 *   const { onNextView, onPrevView, currentIndex, totalViews } = useSurveyContext();
 *   return (
 *     <div>
 *       <p>{currentIndex + 1} of {totalViews}</p>
 *       <button onClick={onPrevView}>Back</button>
 *       <button onClick={onNextView}>Next</button>
 *     </div>
 *   );
 * }
 */
export function useSurveyContext(): SurveyContextType {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error(
      "useSurveyContext must be used within a Survey component. " +
      "Make sure your component is a child of <Survey>."
    );
  }
  return context;
}

// ============================================================================
// Default Navigation & Layout Components
// ============================================================================

/**
 * Props for navigation control customization
 */
type SurveyNavigationControlsProps = {
  /** Label for the back button (default: "Back") */
  backLabel?: string;
  /** Label for the next/submit button (default: "Next" or "Submit") */
  nextLabel?: string;
  /** Additional CSS class for the container */
  className?: string;
  /** Additional CSS class for buttons */
  buttonClassName?: string;
};

/**
 * Default navigation controls component.
 * Provides Back and Next/Submit buttons with automatic labels.
 * 
 * @example
 * <SurveyNavigationControls backLabel="Previous" nextLabel="Continue" />
 */
export function SurveyNavigationControls({
  backLabel = "Back",
  nextLabel,
  className = "flex justify-between gap-2",
  buttonClassName = "px-4 py-2 rounded",
}: SurveyNavigationControlsProps) {
  const { onNextView, onPrevView, isLastView } = useSurveyContext();
  const finalNextLabel = nextLabel || (isLastView ? "Submit" : "Next");

  return (
    <div className={className}>
      <button onClick={onPrevView} className={buttonClassName}>
        {backLabel}
      </button>
      <button onClick={onNextView} className={buttonClassName}>
        {finalNextLabel}
      </button>
    </div>
  );
}

/**
 * Props for progress/step info display
 */
type SurveyProgressProps = {
  /** Format string for progress text (default: "{current} of {total}") */
  format?: string;
  /** Show step IDs instead of numbers (default: false) */
  showIds?: boolean;
  /** Additional CSS class */
  className?: string;
};

/**
 * Displays current progress through survey steps.
 * 
 * @example
 * <SurveyProgress />
 * <SurveyProgress format="Step {current} of {total}" />
 * <SurveyProgress showIds />
 */
export function SurveyProgress({
  format = "{current} of {total}",
  showIds = false,
  className = "text-sm text-gray-600",
}: SurveyProgressProps) {
  const { currentIndex, totalViews, currentViewId } = useSurveyContext();
  
  if (showIds && currentViewId) {
    return <div className={className}>{currentViewId}</div>;
  }

  const progressText = format
    .replace("{current}", String(currentIndex + 1))
    .replace("{total}", String(totalViews));

  return <div className={className}>{progressText}</div>;
}

/**
 * Props for the default survey layout
 */
type SurveyLayoutProps = {
  /** Custom navigation controls component (uses default if not provided) */
  NavigationControls?: ReactNode | React.ComponentType<any>;
  /** Custom header/progress component (uses default if not provided) */
  HeaderContent?: ReactNode | React.ComponentType<any>;
  /** Container CSS class */
  containerClassName?: string;
  /** Header section CSS class */
  headerClassName?: string;
  /** Content section CSS class */
  contentClassName?: string;
  /** Footer/navigation section CSS class */
  footerClassName?: string;
};

/**
 * Default layout component that organizes survey views with navigation.
 * Automatically renders the current view via proxy.
 * 
 * Provides a customizable three-section layout:
 * - Header (progress info)
 * - Content (current view)
 * - Footer (navigation controls)
 * 
 * @example
 * // Basic usage with defaults
 * <Survey>
 *   <SurveyView id="step-1"><Form1 /></SurveyView>
 *   <SurveyView id="step-2"><Form2 /></SurveyView>
 *   <SurveyLayout />
 * </Survey>
 * 
 * @example
 * // Custom navigation component
 * <SurveyLayout NavigationControls={<CustomNavigation />} />
 * 
 * @example
 * // No header
 * <SurveyLayout HeaderContent={null} />
 */
export function SurveyLayout({
  NavigationControls,
  HeaderContent,
  containerClassName = "flex flex-col gap-6 w-full max-w-2xl mx-auto p-6",
  headerClassName = "border-b pb-4",
  contentClassName = "flex-1",
  footerClassName = "border-t pt-4",
}: SurveyLayoutProps) {
  // Resolve navigation controls - if it's a component type, render it, otherwise use as-is
  const resolvedNavigation = NavigationControls === undefined 
    ? <SurveyNavigationControls />
    : typeof NavigationControls === "function"
    ? <NavigationControls />
    : NavigationControls;

  // Resolve header content - if it's a component type, render it, otherwise use as-is
  const resolvedHeader = HeaderContent === undefined 
    ? <SurveyProgress />
    : typeof HeaderContent === "function"
    ? <HeaderContent />
    : HeaderContent;

  return (
    <div className={containerClassName}>
      {HeaderContent !== null && <div className={headerClassName}>{resolvedHeader}</div>}
      
      <div className={contentClassName}>
        <SurveyViewProxy />
      </div>

      <div className={footerClassName}>{resolvedNavigation}</div>
    </div>
  );
}
