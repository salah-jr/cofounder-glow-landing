
export function generateValueProposition(answers: any[], questions: any[]): string {
  const problemType = answers.find(a => a.questionId === 1)?.selectedAnswer || "problem";
  
  const valueProps = {
    "Daily inconvenience": "Simplifying everyday tasks to save time and reduce stress",
    "Business inefficiency": "Optimizing business processes to increase productivity and reduce costs",
    "Social issue": "Creating meaningful connections and positive social impact",
    "Entertainment need": "Delivering engaging experiences that captivate and inspire",
    "Health challenge": "Improving wellbeing through innovative health solutions"
  };
  
  return valueProps[problemType as keyof typeof valueProps] || 
    "Delivering innovative solutions to transform how people interact with technology";
}

export function generateTargetAudience(answers: any[], questions: any[]): string {
  const audience = answers.find(a => a.questionId === 2)?.selectedAnswer || "professionals";
  
  const audienceMap = {
    "Young professionals": "Career-focused individuals seeking efficiency and growth",
    "Small businesses": "Independent ventures looking to scale and optimize operations",
    "Enterprise companies": "Large organizations requiring enterprise-grade solutions",
    "Students": "Education-focused users seeking knowledge and skill development",
    "Parents": "Family-oriented customers prioritizing care and convenience"
  };
  
  return audienceMap[audience as keyof typeof audienceMap] || 
    "Technology-savvy users looking for innovative solutions";
}

export function generateRevenueStream(answers: any[], questions: any[]): string {
  const model = answers.find(a => a.questionId === 3)?.selectedAnswer || "Subscription";
  
  const modelMap = {
    "Subscription": "Recurring revenue through tiered subscription plans",
    "One-time purchase": "Direct sales with potential for premium upgrades",
    "Freemium": "Free core offering with premium features for paying users",
    "Marketplace fee": "Transaction fees from facilitating exchanges between users",
    "Advertising": "Revenue generated through targeted advertising opportunities"
  };
  
  return modelMap[model as keyof typeof modelMap] || 
    "Multi-channel approach combining direct and indirect revenue streams";
}

export function generateStartupName(answers: any[], questions: any[]): string {
  const problem = answers.find(a => a.questionId === 1)?.selectedAnswer || "";
  const audience = answers.find(a => a.questionId === 2)?.selectedAnswer || "";
  
  const nameOptions = {
    "Daily inconvenience": ["EaseFlow", "SimpliDay", "RoutineGo", "DailyZen"],
    "Business inefficiency": ["OptiCore", "FlowSync", "ProdMatrix", "EfficiWare"],
    "Social issue": ["ImpactHub", "CommUnity", "SocialSphere", "ConnectForward"],
    "Entertainment need": ["JoyWave", "PlayPulse", "FunFusion", "VibeVerse"],
    "Health challenge": ["VitalSync", "WellNova", "HealthPulse", "MindBody"]
  };
  
  const names = nameOptions[problem as keyof typeof nameOptions] || 
    ["NexGen", "InnoVision", "FusionTech", "PulseWare"];
  
  return names[Math.floor(Math.random() * names.length)];
}
