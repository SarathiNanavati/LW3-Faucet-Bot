import UserRequestCoolDown, { IUserRequestCoolDownSchema } from "../database/UserRequestCoolDown";

export const getUserRequestCoolDown = async (
  address: string,
  chain: string,
  token: string
): Promise<IUserRequestCoolDownSchema | null> => {
  const user = await UserRequestCoolDown.findOne({ address, chain, token });

  return user ?? null;
};

export const createOrUpdate = async (
  discordId: string,
  address: string,
  chain: string,
  token: string
) => {
  let user = await UserRequestCoolDown.findOne({ discordId, address, chain, token });

  if (user) {
    user.lastRequestDate = Date.now();
    await user.save();
  } else {
    await UserRequestCoolDown.create({ discordId, address, chain, token });
  }
};
