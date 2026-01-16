import { useState } from 'react';

function Wizard({ isDarkMode, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to TO-DO! 👋",
      content: "Organize your tasks and groceries with style",
      features: [
        { icon: "☁️", text: "Sign in with Google for cloud sync" },
        { icon: "📱", text: "Access your lists on any device" },
        { icon: "✨", text: "Beautiful neobrutalist design" }
      ]
    },
    {
      title: "Powerful Features 🚀",
      content: "Everything you need to stay organized",
      features: [
        { icon: "📋", text: "Switch between TODO and GROCERIES lists" },
        { icon: "🥑", text: "Groceries auto-categorize by type" },
        { icon: "✅", text: "Track progress with smart counters" }
      ]
    },
    {
      title: "Make it Yours 🎨",
      content: "Customize to match your style",
      features: [
        { icon: "🌙", text: "Toggle dark mode anytime" },
        { icon: "🎨", text: "Choose from beautiful background themes" },
        { icon: "💾", text: "All preferences sync automatically" }
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    localStorage.setItem('hasSeenWizard', 'true');
    onClose();
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
      <div 
        className={`relative w-full max-w-md border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slideIn ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 w-8 h-8 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black flex items-center justify-center ${
            isDarkMode ? 'bg-red-400' : 'bg-red-400'
          }`}
          aria-label="Close wizard"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Title */}
          <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${
            isDarkMode ? 'text-yellow-400' : 'text-black'
          }`}>
            {step.title}
          </h2>

          {/* Subtitle */}
          <p className={`text-lg font-bold mb-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {step.content}
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {step.features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                <span className={`font-bold ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleClose}
              className={`flex-1 px-6 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 font-black ${
                isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'
              }`}
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-blue-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 font-black text-black"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-3">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 border-2 border-black ${
                  index === currentStep
                    ? 'bg-yellow-400'
                    : index < currentStep
                    ? 'bg-green-400'
                    : isDarkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step indicator text */}
          <p className={`text-center text-sm font-bold ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Wizard;
