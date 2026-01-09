/**
 * Survey Component Usage Examples
 * 
 * This file demonstrates various ways to use the Survey system with different
 * levels of customization.
 */

import { Survey, SurveyView, SurveyLayout, SurveyNavigationControls, SurveyProgress, useSurveyContext } from "../../app/periodontics/components/SurveyView";

// ============================================================================
// Example 1: Basic Usage - Everything Default
// ============================================================================
export function BasicSurveyExample() {
  const handleCancel = () => console.log("Survey cancelled");
  const handleSubmit = () => console.log("Survey submitted");

  return (
    <Survey onSubmit={handleSubmit} onCancel={handleCancel}>
      <SurveyView id="personal-info">
        <div className="space-y-4">
          <h2>Personal Information</h2>
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
        </div>
      </SurveyView>

      <SurveyView id="address">
        <div className="space-y-4">
          <h2>Address</h2>
          <input type="text" placeholder="Street Address" />
          <input type="text" placeholder="City" />
        </div>
      </SurveyView>

      <SurveyView id="confirmation">
        <div className="space-y-4">
          <h2>Confirm Details</h2>
          <p>Please review your information before submitting</p>
        </div>
      </SurveyView>

      {/* Layout with all defaults */}
      <SurveyLayout />
    </Survey>
  );
}

// ============================================================================
// Example 2: Custom Navigation Labels
// ============================================================================
export function CustomNavLabelsExample() {
  return (
    <Survey onSubmit={() => console.log("Complete")}>
      <SurveyView id="step-1">
        <div>Step 1 Content</div>
      </SurveyView>

      <SurveyView id="step-2">
        <div>Step 2 Content</div>
      </SurveyView>

      {/* Customize navigation button labels */}
      <SurveyLayout
        navigationControls={
          <SurveyNavigationControls
            backLabel="← Previous"
            nextLabel="Continue →"
            buttonClassName="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          />
        }
      />
    </Survey>
  );
}

// ============================================================================
// Example 3: Custom Progress Display
// ============================================================================
export function CustomProgressExample() {
  return (
    <Survey onSubmit={() => console.log("Complete")}>
      <SurveyView id="form-step-1">
        <div>Form Step 1</div>
      </SurveyView>

      <SurveyView id="form-step-2">
        <div>Form Step 2</div>
      </SurveyView>

      <SurveyView id="form-step-3">
        <div>Form Step 3</div>
      </SurveyView>

      {/* Show step IDs instead of numbers */}
      <SurveyLayout
        headerContent={<SurveyProgress showIds className="text-lg font-semibold" />}
      />
    </Survey>
  );
}

// ============================================================================
// Example 4: Fully Custom Navigation Component
// ============================================================================
function CustomNavigationButtons() {
  const { onNextView, onPrevView, currentIndex, totalViews, isFirstView, isLastView } = useSurveyContext();

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrevView}
        disabled={isFirstView}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        ← Back
      </button>

      <div className="text-center">
        <div className="flex gap-2">
          {Array.from({ length: totalViews }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === currentIndex ? "bg-blue-500" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onNextView}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isLastView ? "Submit" : "Next"} →
      </button>
    </div>
  );
}

export function CustomNavigationExample() {
  return (
    <Survey onSubmit={() => console.log("Complete")}>
      <SurveyView id="step-1">
        <div>Content 1</div>
      </SurveyView>

      <SurveyView id="step-2">
        <div>Content 2</div>
      </SurveyView>

      <SurveyView id="step-3">
        <div>Content 3</div>
      </SurveyView>

      {/* Custom navigation with dot indicators */}
      <SurveyLayout navigationControls={<CustomNavigationButtons />} />
    </Survey>
  );
}

// ============================================================================
// Example 5: Fully Custom Header and Layout
// ============================================================================
function CustomHeader() {
  const { currentViewId, currentIndex, totalViews } = useSurveyContext();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded">
      <h1 className="text-2xl font-bold mb-2">
        {currentViewId ? currentViewId.toUpperCase() : `Step ${currentIndex + 1}`}
      </h1>
      <div className="w-full bg-gray-300 rounded h-1">
        <div
          className="bg-white h-full rounded transition-all"
          style={{ width: `${((currentIndex + 1) / totalViews) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function FullyCustomExample() {
  return (
    <Survey onSubmit={() => console.log("Complete")}>
      <SurveyView id="contact-info">
        <div>Contact Information Form</div>
      </SurveyView>

      <SurveyView id="preferences">
        <div>Preferences Form</div>
      </SurveyView>

      {/* Fully customized header and layout */}
      <SurveyLayout
        headerContent={<CustomHeader />}
        navigationControls={
          <div className="flex gap-4">
            <button className="flex-1 px-4 py-2 border border-gray-300 rounded">Back</button>
            <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded">Next</button>
          </div>
        }
        containerClassName="space-y-6"
        headerClassName="rounded-lg shadow"
        contentClassName="bg-gray-50 p-6 rounded-lg min-h-96"
        footerClassName=""
      />
    </Survey>
  );
}

// ============================================================================
// Example 6: No Header, Just Content and Navigation
// ============================================================================
export function MinimalLayoutExample() {
  return (
    <Survey onSubmit={() => console.log("Complete")}>
      <SurveyView id="step-1">
        <div>Step 1 Content</div>
      </SurveyView>

      <SurveyView id="step-2">
        <div>Step 2 Content</div>
      </SurveyView>

      {/* Remove header by passing null */}
      <SurveyLayout headerContent={null} />
    </Survey>
  );
}
