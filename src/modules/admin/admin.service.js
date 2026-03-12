export const getDashboardStats = async () => {
  return {
    recruiters: {
      total: 120,
      active: 90,
      churned: 30
    },
    candidates: {
      totalRegistered: 4500,
      appliedForJobs: 3000,
      qualifiedCandidates: 1100,
      hiredThroughPlatform: 400
    }
  };
};

export const getRecruiterAnalytics = async () => {
  return [
    {
      recruiterId: "123",
      jobsPosted: 12,
      active: true
    }
  ];
};

export const getCandidateAnalytics = async () => {
  return {
    registered: 5000,
    applied: 3800,
    qualified: 1200,
    hired: 430
  };
};

export const getPlatformAnalytics = async () => {
  return {
    qualificationRate: 32,
    recruiterReturnRate: 67,
    candidateSatisfaction: 4.2
  };
};

export const getNotifications = async () => {
  return [
    { message: "New recruiter registered" },
    { message: "Job requires moderation" }
  ];
};

export const getUsers = async () => {
  return [];
};

export const suspendUser = async (userId) => {
  return { message: `User ${userId} suspended` };
};

export const deleteUser = async (userId) => {
  return { message: `User ${userId} deleted` };
};

export const moderateJob = async (jobId) => {
  return { message: `Job ${jobId} removed` };
};