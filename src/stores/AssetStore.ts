import { defineStore } from 'pinia'
import type { PublicAsset } from '@/models/PublicAsset'
import { CurrencyEnum } from '@/models/enums/CurrencyEnum'
import type { GenericHolding } from '@/models/holdings/GenericHolding'
import type { PublicHolding } from '@/models/holdings/PublicHolding'
import type {PrivateHolding} from "@/models/holdings/PrivateHolding";
import type {HoldingGroup} from "@/models/holdings/HoldingGroup";

/***********************************************************************************/
/* --------------------------------- Asset Store ----------------------------------*/
/***********************************************************************************/

export type RootState = {
  searchString: string
  searchbarAssets: PublicAsset[]
  searchbarResultCount: number
  searchbarLoadingFlag: boolean
  genericHoldingRows: GenericHolding[]
  selectedAssetCount: number
  showGroupWrapper: boolean
  activeModalUnderlay: boolean
}

export const useAssetStore = defineStore('assetStore', {
  state: () =>
    ({
      /** Reactive asset searchbar */
      searchString: '',
      searchbarAssets: [],
      searchbarResultCount: 0,
      searchbarLoadingFlag: false,
      /** Reactive list object */
      genericHoldingRows: [],
      /** Count that is used, to determine what action buttons should be active */
      selectedAssetCount: 0,
      showGroupWrapper: false,
      activeModalUnderlay: false,
    } as RootState),

  actions: {

    /**
     * Update an entry of the genericHoldingRows
     *
     * @param patchedHolding PublicHolding
     */
    updatePublicHolding(patchedHolding: PublicHolding) {
        this.genericHoldingRows.forEach((value, key) => {
            if (value.publicHolding !== undefined) {
                if (value.publicHolding!.holdingUuid === patchedHolding.holdingUuid) {
                    // Update the public holding entry
                    this.genericHoldingRows[key].publicHolding = patchedHolding
                }
            }
        })
    },

      /**
       * Update an entry of the genericHoldingRows
       *
       * @param patchedHolding PrivateHolding
       */
      updatePrivateHolding(patchedHolding: PrivateHolding) {
          this.genericHoldingRows.forEach((value, key) => {
              if (value.privateHolding !== undefined) {
                  if (value.privateHolding!.holdingUuid === patchedHolding.holdingUuid) {
                      // Update the public holding entry
                      this.genericHoldingRows[key].privateHolding = patchedHolding
                  }
              }
          })
      },

      /**
       * Update an entry of the genericHoldingRows
       *
       * @param patchedHolding PublicHolding
       */
      updateHoldingGroup(patchedHolding: HoldingGroup) {
          this.genericHoldingRows.forEach((value, key) => {
              if (value.holdingGroup !== undefined) {
                  if (value.holdingGroup!.uuid === patchedHolding.uuid) {
                      // Update the public holding entry
                      this.genericHoldingRows[key].holdingGroup = patchedHolding
                  }
              }
          })
      },


      /**
     * Iterate over the searchbar assets and check if the uuid matches the passed uuid
     *
     * @param uuid
     */
    getSearchbarAsset(uuid: string): PublicAsset {
      // Ensure that the searchbar assets array is not empty
      if (this.searchbarAssets.length === 0) {
        return {} as PublicAsset
      }
      // Loop over the searchbar assets and check if the uuid matches the passed uuid
      for (const asset of this.searchbarAssets) {
        if (asset.uuid === uuid) return asset
      }
      // If there is no asset with the passed uuid, return an empty object
      return {} as PublicAsset
    },

    /**
     * Take a value and explode it into an array that can be used to access the single values
     *
     * @param assetValue
     *
     * @returns {string[]}
     */
    getValueArray(assetValue: number): string[] {
      // Parse the value of the asset to string
      const valueString: string = assetValue.toString()

      // create the value array by splitting the float
      const valueArray: string[] = valueString.split('.')

      const firstDigit = valueArray[0]
      let firstDecimal = valueArray[1]
      let secondDecimal = ''

      // If the first decimal is only one character long, add a zero to its end
      if (firstDecimal.length === 1) {
        firstDecimal = firstDecimal + '0'
      }

      // If the first decimal is greater than two characters, split it
      if (firstDecimal.length > 2) {
        secondDecimal = firstDecimal.slice(2, 3)
        firstDecimal = firstDecimal.slice(0, 2)
      }

      return [firstDigit, firstDecimal, secondDecimal]
    },

    /**
     * Map the currency of an assets to its symbol
     *
     * @param currency string
     */
    mapCurrency(currency: CurrencyEnum): string {
      switch (currency) {
        default:
        case CurrencyEnum.UNSUPPORTED:
          return '?'
        case CurrencyEnum.EUR:
          return '€'
        case CurrencyEnum.USD:
          return '$'
      }
    },
  },
})
