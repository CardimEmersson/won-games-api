import AuthLogo from "./extensions/logo-won-dark.svg";
import favicon from "./extensions/favicon.png";
import MenuLogo from "./extensions/favicon.png";

const wonColors = {
  blueLight: "#10132d",
  blue: "#0a0d27",
  blueDark: "#06081b",
  pink: "#f231a5",
  orange: "#f56161",
};

export default {
  config: {
    // Replace the Strapi logo in auth (login) views
    auth: {
      logo: AuthLogo,
    },
    head: {
      favicon,
    },
    tutorials: false,
    menu: {
      logo: MenuLogo,
    },
    theme: {
      color: {
        alternative100: "#f6ecfc",
        alternative200: "#e0c1f4",
        alternative500: "#ac73e6",
        alternative600: "#9736e8",
        alternative700: "#8312d1",
        danger100: "#fcecea",
        danger200: "#f5c0b8",
        danger500: "#ee5e52",
        danger600: "#d02b20",
        danger700: "#b72b1a",
        neutral0: wonColors.blue,
        neutral100: "#f6f6f9",
        neutral150: "#eaeaef",
        neutral200: "#dcdce4",
        neutral300: "#c0c0cf",
        neutral400: "#a5a5ba",
        neutral500: "#8e8ea9",
        neutral600: "#666687",
        neutral700: "#4a4a6a",
        neutral800: "#32324d",
        neutral900: "#212134",
        primary100: "#f0f0ff",
        primary200: "#d9d8ff",
        primary500: "#7b79ff",
        primary600: "#4945ff",
        primary700: "#271fe0",
        secondary100: "#eaf5ff",
        secondary200: "#b8e1ff",
        secondary500: "#66b7f1",
        secondary600: "#0c75af",
        secondary700: "#006096",
        success100: "#eafbe7",
        success200: "#c6f0c2",
        success500: "#5cb176",
        success600: "#328048",
        success700: "#2f6846",
        warning100: "#fdf4dc",
        warning200: "#fae7b9",
        warning500: "#f29d41",
        warning600: "#d9822f",
        warning700: "#be5d01",
      },
    },
  },

  bootstrap() {},
};
