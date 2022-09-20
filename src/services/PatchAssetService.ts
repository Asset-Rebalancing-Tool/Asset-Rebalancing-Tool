import type {PublicHoldingRequest} from '@/requests/PublicHoldingRequest'
import type {PrivateHoldingRequest} from '@/requests/PrivateHoldingRequest'
import {getAuthorizedInstance, handleErrorResponseStatus,} from '@/services/TokenService'
import type {AxiosResponse} from 'axios'
import type {HoldingGroupRequest} from '@/requests/HoldingGroupRequest'
import {useAssetStore} from '@/stores/AssetStore'
import {InputStatusEnum} from "@/models/enums/InputStatusEnum";

let abortController: AbortController | null = new AbortController()
let timer: ReturnType<typeof setTimeout> | null = null
let inputStatus: InputStatusEnum = InputStatusEnum.NONE

export default {

   /**-***********************************************************************-**/
   /**--------------------------- Patch Holdings ------------------------------**/
   /**-***********************************************************************-**/

    /**
   * Patch a public holding based on its uuid
   *
   * @param request PublicHoldingRequest
   * @param uuid string
   */
  async patchPublicHolding(
    request: PublicHoldingRequest,
    uuid: string
  ): Promise<void> {
    this.requestRestrictionHandling().then(() => {
        return getAuthorizedInstance()
        .then((instance) => {
            abortController = new AbortController
            return instance.patch(
                `/holding_api/asset_holding/public/${uuid}`,
                request,
                {
                    signal: abortController.signal as AbortSignal
                }
            )
        })
        .then((response: AxiosResponse) => {
            this.saveInputAnimation()
            useAssetStore().replaceListEntry(response.data)
        })
        .catch((error) => handleErrorResponseStatus(error.response.status))
    }).catch((error) => handleErrorResponseStatus(error.response.status))
  },

  /**
   * Patch a private holding based on its uuid
   *
   * @param request PrivateHoldingRequest
   * @param holdingUuid string
   */
  async patchPrivateHolding(
    request: PrivateHoldingRequest,
    holdingUuid: string
  ): Promise<void> {
    this.requestRestrictionHandling().then(() => {
        return getAuthorizedInstance()
          .then((instance) => {
            return instance.patch(
              `/holding_api/asset_holding/private/${holdingUuid}`,
              request
            )
          })
          .then((response: AxiosResponse) => {
            useAssetStore().replaceListEntry(response.data)
          })
          .catch((error) => handleErrorResponseStatus(error.response.status))
    }).catch((error) => handleErrorResponseStatus(error.response.status))
  },

  /**
   * Patch a holding group based on its uuid
   *
   * @param request PrivateHoldingRequest
   * @param groupUuid string
   */
  async patchHoldingGroup(
    request: HoldingGroupRequest,
    groupUuid: string
  ): Promise<void> {
      this.requestRestrictionHandling().then(() => {
    return getAuthorizedInstance()
      .then((instance) => {
        return instance.patch(
          `/holding_api/asset_holding/group/${groupUuid}`,
          request
        )
      })
      .then((response: AxiosResponse) => {
        useAssetStore().replaceListEntry(response.data)
      })
      .catch((error) => handleErrorResponseStatus(error.response.status))
      }).catch((error) => handleErrorResponseStatus(error.response.status))
  },

  /**-***********************************************************************-**/
  /**-------------------------- Delete Holdings ------------------------------**/
  /**-***********************************************************************-**/

  async deletePublicHolding(holdingUuid: string) {
    return getAuthorizedInstance()
      .then((instance) => {
        return instance.delete(
          `/holding_api/asset_holding/public/${holdingUuid}`
        )
      })
      .then((response: AxiosResponse) => {})
      .catch((error) => handleErrorResponseStatus(error.response.status))
  },

  async deletePrivateHolding(holdingUuid: string) {
    return getAuthorizedInstance()
      .then((instance) => {
        return instance.delete(
          `/holding_api/asset_holding/private/${holdingUuid}`
        )
      })
      .then((response: AxiosResponse) => {})
      .catch((error) => handleErrorResponseStatus(error.response.status))
  },

    /**-***********************************************************************-**/
    /**------------------------- Auxiliary Methods -----------------------------**/
    /**-***********************************************************************-**/

    requestRestrictionHandling(): Promise<void> {
      // Always abort previous requests
      if (abortController) {
          abortController.abort()
          abortController = null
      }
      // Reset the input animation
      inputStatus = InputStatusEnum.LOAD

      // If this method is called before the timer has expired, reset it
      // If there is no timer and therefore no request, set the isLoading flag to true
      if (timer) {
          clearTimeout(timer)
          timer = null
      }

      return new Promise<void>((resolve) => resolve())
  },

  saveInputAnimation() {
      inputStatus = InputStatusEnum.SAVE
      setTimeout(() => {
          inputStatus = InputStatusEnum.NONE
      }, 500)
  }
}
