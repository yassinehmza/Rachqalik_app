const isPlanActive = (user) => {
  if (!user) {
    return false;
  }

  if (user.plan === 'premium') {
    return true;
  }

  const trialDays = 15;
  const createdAt = new Date(user.createdAt).getTime();
  const now = Date.now();
  const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

  return diffDays < trialDays;
};

const requireActivePlan = (req, res, next) => {
  if (isPlanActive(req.user)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Free trial expired after 15 days. Upgrade to premium to continue.',
  });
};

module.exports = { requireActivePlan };
