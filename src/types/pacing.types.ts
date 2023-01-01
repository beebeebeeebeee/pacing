import { DistanceUnitConstant } from '@src/constants'

export interface PacingPayload {
  unit: DistanceUnitConstant
  distance?: number
  time?: number
  pacing?: number
}
