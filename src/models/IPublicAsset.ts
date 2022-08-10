import type { IPriceRecord } from '@/models/IPriceRecord'
import type { IAssetInformation } from '@/models/IAssetInformation'
import type { IUiProperties } from '@/models/IUiProperties'

export interface IPublicAsset {
  uuid: string
  assetInformations?: IAssetInformation[] | null
  assetName: string
  assetType: string
  isin: string
  priceRecords?: IPriceRecord[] | null
  symbol: string
  ownedQuantity: string
  uiProperties?: IUiProperties | null
}
