import { propertyOrdering, selectorOrdering } from "stylelint-semantic-groups";

export default {
  plugins: ["stylelint-order"],
  rules: {
    "order/order": selectorOrdering,
    "order/properties-order": propertyOrdering,
  },
};
