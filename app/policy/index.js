import { AbilityBuilder, Ability } from "@casl/ability";

const policies = {
  guest(user, builder) {
    builder.can("read", "Product");
  },
  user(user, builder) {
    builder.can("view", "DeliveryAddress");
    builder.can("create", "DeliveryAddress");
    builder.can("update", "DeliveryAddress", { user_id: user._id });
    builder.can("delete", "DeliveryAddress", { user_id: user._id });
  },
  admin(user, builder) {
    builder.can("manage", "all");
  },
};

export const policyFor = (user) => {
  const builder = new AbilityBuilder();

  if (user && typeof policies[user.role] === "function") {
    policies[user.role](user, builder);
  } else {
    policies["guest"](user, builder);
  }

  return new Ability(builder.rules);
};
