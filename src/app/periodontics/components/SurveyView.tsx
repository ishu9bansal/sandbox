import { Children, createContext, isValidElement, ReactNode, useCallback, useContext, useState } from "react";

export function SurveyView({ id, children }: { id: string; children: ReactNode }) {
  return <>{children}</>;
}

export function SurveyViewProxy() {
  const { CurrentView } = useSurveyContext();
  return <CurrentView />;
}

type SurveyProps = {
  children: ReactNode;
  defaultViewIndex?: number;
  // TODO: implement controlled mode later
  // viewIndex?: number;
  // onViewIndexChange?: (index: number) => void;
};
export function Survey({ children, defaultViewIndex = 0 }: SurveyProps) {
  const [index, setIndex] = useState(defaultViewIndex);
  const surveyChildren = Children.toArray(children).filter(surveyFilter);
  const restChildren = Children.toArray(children).filter(child => !surveyFilter(child));
  const CurrentView = () => <>{surveyChildren[index]}</> || null;
  const currentViewId = surveyChildId(surveyChildren[index]);
  const nextViewId = surveyChildId(surveyChildren[index + 1]);
  const prevViewId = surveyChildId(surveyChildren[index - 1]);
  const onNextView = useCallback(() => setIndex((prev) => (prev+1)), []);
  const onPrevView = useCallback(() => setIndex((prev) => (prev-1)), []);
  return (
    <SurveyContext
      value={{
        CurrentView,
        onNextView,
        onPrevView,
        currentViewId,
        nextViewId,
        prevViewId,
      }
    }>
      {restChildren}
    </SurveyContext>
  );
}

const surveyChildId = (child: any) => {
  if (isValidElement(child)) {
    return child.props?.id || null;
  }
  return null;
};

const surveyFilter = (child: ReactNode) => {
  if (isValidElement(child)) {
    return child.type === SurveyView;
  }
  return false;
};

type SurveyContextType = {
  CurrentView: () => ReactNode;
  onNextView: () => void;
  onPrevView: () => void;
  currentViewId: string | null;
  nextViewId: string | null;
  prevViewId: string | null;
};
const SurveyContext = createContext<SurveyContextType>({
  CurrentView: () => null,
  onNextView: () => {},
  onPrevView: () => {},
  currentViewId: null,
  nextViewId: null,
  prevViewId: null,
});
export function useSurveyContext() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurveyContext must be used within a SurveyProvider");
  }
  return context;
}
