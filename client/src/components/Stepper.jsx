import React, { useState, Children, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => { },
  onFinalStepCompleted = () => { },
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  disableNavigation = () => false, // Add this prop with a default function
  renderStepIndicator,
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep) => {
    // Check if navigation to this step should be disabled
    if (disableNavigation(newStep)) return;
    
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Check if navigation to previous step should be disabled
      if (disableNavigation(currentStep - 1)) return;
      
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      // Check if navigation to next step should be disabled
      if (disableNavigation(currentStep + 1)) return;
      
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center p-4 sm:aspect-[4/3] md:aspect-[2/1]"
      {...rest}
    >
      <div
        className={`mx-auto w-full max-w-md rounded-lg border bg-white shadow-sm ${stepCircleContainerClassName}`}
      >
        {/* Header section similar to FileUploader */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">Resume Wizard</h2>
          {/* <span className="text-xs text-gray-500">Step {currentStep} of {totalSteps}</span> */}
        </div>
        
        {/* Step indicators */}
        <div className={`${stepContainerClassName} flex w-full items-center p-4 sm:p-6 border-b`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      // Check if navigation to this step should be disabled
                      if (disableNavigation(clicked)) return;
                      
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    isDisabled={disableNavigation(stepNumber)}
                    onClickStep={(clicked) => {
                      // Check if navigation to this step should be disabled
                      if (disableNavigation(clicked)) return;
                      
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Content area */}
        <div className="p-4 sm:p-6">
          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={currentStep}
            direction={direction}
            className={`p-4 sm:p-6 ${contentClassName}`}
          >
            {stepsArray[currentStep - 1]}
          </StepContentWrapper>
        </div>

        
        {/* Footer with navigation buttons */}
        {!isCompleted && (
          <div className={`flex justify-center p-3 sm:p-4 border-t ${footerClassName}`}>
            <div
              className={`mt-2 flex w-full ${currentStep !== 1 ? "justify-between" : "justify-end"}`}
            >
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 rounded-md transition-colors"
                  disabled={disableNavigation(currentStep - 1)}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-[#2563EB] hover:bg-[#1d4ed8] rounded-md transition-colors flex items-center gap-2"
                disabled={isLastStep ? false : disableNavigation(currentStep + 1)}
                {...nextButtonProps}
              >
                {isLastStep ? "Complete" : nextButtonText}
                {!isLastStep && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Update StepIndicator to handle the disabled state
function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators, isDisabled }) {
  const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators && !isDisabled) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`relative ${(disableStepIndicators || isDisabled) ? 'cursor-default' : 'cursor-pointer'} outline-none focus:outline-none`}
      animate={status}
      initial={false}
      style={{ opacity: isDisabled ? 0.6 : 1 }}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: "#f3f4f6", color: "#9ca3af" },
          active: { scale: 1, backgroundColor: "#2563EB", color: "#ffffff" },
          complete: { scale: 1, backgroundColor: "#2563EB", color: "#ffffff" },
        }}
        transition={{ duration: 0.3 }}
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold"
      >
        {status === "complete" ? (
          <CheckIcon className="h-4 w-4 text-white" />
        ) : status === "active" ? (
          <span className="text-sm text-white">{step}</span>
        ) : (
          <span className="text-sm">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

// Rest of the component functions remain the same
function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

export function Step({ children }) {
  return <div>{children}</div>;
}

function StepConnector({ isComplete }) {
  const lineVariants = {
    incomplete: { width: 0, backgroundColor: "rgba(0,0,0,0)" },
    complete: { width: "100%", backgroundColor: "#2563EB" },
  };

  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-gray-200">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}