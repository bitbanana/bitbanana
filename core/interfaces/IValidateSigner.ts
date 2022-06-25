//
//
//

// in-mod
import { ValidatorSigContent } from "../types/ValidatorSigContent.ts";

export interface IValidateSigner {
  createSig(sigContent: ValidatorSigContent): string;
}
