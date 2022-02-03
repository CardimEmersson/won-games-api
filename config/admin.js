// import AuthLogo from "./extensions/logo-won-dark.svg";

module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "686ea5a00901cbd2e9e38e0053e48fd1"),
  },
});
