//
//
//

// bitbanana
import { Validator } from "../../bitbanana/mod.ts";
// in-mod
import { bitfruitExAddr } from "../config/config.ts";
import { ValidateSigner } from "./ValidateSigner.ts";

const signer = new ValidateSigner();

// use this as validator in the server
export function initValidator(): Validator {
  const validator = new Validator(
    bitfruitExAddr,
    signer,
  );
  return validator;
}
