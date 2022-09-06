import type { CurrencyEnum } from '@/models/enums/CurrencyEnum'
import type { UnitType } from '@/models/enums/UnitTypeEnum'

export interface PublicAssetHoldingRequest {
  currency: CurrencyEnum
  customName: string
  ownedQuantity: number
  publicAssetUuid: string
  selectedUnitType: UnitType
  shouldDisplayCustomName: boolean
  targetPercentage: number
}
