const PRODUCTION = "warsawjs.keanuharrell.com";
const DEV = `dev.${PRODUCTION}`;
const DEMO = `demo.${PRODUCTION}`;

export const { domain } = (() => {
  if ($app.stage === "prod")
    return {
      domain: PRODUCTION,
    };

  if ($app.stage === "dev")
    return {
      domain: DEV,
    };

  if ($app.stage === "demo") 
    return {
      domain: DEMO,
    };

  return {
    domain: `${$app.stage}.${DEV}`,
  };
})();
