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
