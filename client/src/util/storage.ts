import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export async function setInStorage(key: any, obj: any) {
  await Storage.set({
    key: key,
    value: JSON.stringify(obj)
  });
}

export async function getFromStorage(k: string) {
  const ret = await Storage.get({ key: k });
  return !ret.value ? null : JSON.parse(ret.value);
}
