//
//
//

// bitbanana
import { IValidateSigner, ValidatorSigContent } from "../../bitbanana/mod.ts";

// in-mod
import { bitfruitExTmpSig } from "../config/config.ts";

/// ValidateSigner
export class ValidateSigner implements IValidateSigner {
  // deno-lint-ignore no-unused-vars
  createSig(sigContent: ValidatorSigContent): string {
    return bitfruitExTmpSig;
  }
}
