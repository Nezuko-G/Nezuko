import { postRequest } from "@/lib/axios/dist/requests";
import { apis } from "@/lib/api/config";
import { throwIfError } from "@/lib/api/utils";

export async function login(data: { companyEmail: string; userEmail: string; password: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await postRequest<any>({ api: apis.auth.login, body: data });
  throwIfError(res);
  return res.data;
}
