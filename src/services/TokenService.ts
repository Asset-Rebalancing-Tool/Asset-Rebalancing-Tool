import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import type { AuthRequest } from '@/requests/AuthRequest'
import router from '@/router'
import { useSearchStore } from '@/stores/SearchStore'
import { useNotificationStore } from '@/stores/NotificationStore'
import { FlashMessageColorEnum } from '@/models/enums/FlashMessageColorEnum'
import { FlashMessageIconEnum } from '@/models/enums/FlashMessageIconEnum'
// @ts-ignore
import { useI18n } from 'vue-i18n'

/**-******************************************************************-**/
/**---------------------- Authorize Axios Instance --------------------**/
/**-******************************************************************-**/

// The token Datetime
let lastFetched: Date = new Date()

/**
 * Get an authorized axios instance in order to get, post or patch data
 *
 * @return Promise<AxiosInstance>
 */
export function getAuthorizedInstance(): Promise<AxiosInstance> {
  // Check if there is a token deposited
  if (localStorage.getItem('token') === null) {
    return Promise.reject(new Error('should call login first'))
  }

  // Check if the token has expired
  if (lastFetched < new Date(Date.now() - 1000 * 60 * 2)) {
    // fetch a new token if so
    lastFetched = new Date()
    return axios
      .get('/auth_api/renew', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((response) => {
        const instance = axios.create()
        localStorage.setItem('token', response.data)
        instance.defaults.headers.common['Authorization'] =
          'Bearer ' + localStorage.getItem('token')
        return instance
      })
  }

  // Create the axios instance and set the token as header
  const instance = axios.create()
  instance.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token')

  // Return the authorized instance
  return new Promise<AxiosInstance>((resolve) => resolve(instance))
}

/**-******************************************************************-**/
/**---------------------- Token Based User Actions --------------------**/
/**-******************************************************************-**/

/**
 * Create a new user account, based on the email and password
 *
 * @param request
 *
 * @return Promise<void>
 */
export function registerUser(request: AuthRequest): Promise<void> {
  return axios
    .post('/auth_api/register', request)
    .then((response: AxiosResponse) => redirectToDashboard(response.data))
    .catch((error) => handleErrorResponseStatus(error))
}

/**
 * Try to log in a user, based on the email and password
 *
 * @param request AuthRequest
 *
 * @return Promise<void>
 */
export function loginUser(request: AuthRequest): Promise<void> {
  return axios
    .post<AuthRequest, AxiosResponse<string>>('/auth_api/login', request)
    .then((response) => redirectToDashboard(response.data))
    .catch((error) => handleErrorResponseStatus(error))
}

/**
 * Log out a user by removing the token from the local storage and hiding the sidebar
 *
 * @return void
 */
export const logoutUser = (): void => redirectToLogin()

/**-******************************************************************-**/
/**--------------------- Router Redirect Functions --------------------**/
/**-******************************************************************-**/

/**
 * Redirect to the sign-in router view
 *
 * Reset the token datetime, remove the token from localstorage, change the router view and hide the sidebar
 *
 * @return void
 */
function redirectToLogin(): void {
  const searchbarStore = useSearchStore()
  lastFetched = new Date('0000-00-00')
  localStorage.removeItem('token')
  router.push('/sign-in')
  searchbarStore.showSidebar = false
}

/**
 * Redirect to the asset list router view
 *
 * Set the token datetime, add the token to localstorage, change the router view and show the sidebar
 *
 * @return void
 */
function redirectToDashboard(token: string): void {
  const searchbarStore = useSearchStore()
  lastFetched = new Date()
  localStorage.setItem('token', token)
  router.push('/asset-list')
  searchbarStore.showSidebar = true
}

/**-******************************************************************-**/
/**---------------------- Token Based User Actions --------------------**/
/**-******************************************************************-**/

/**
 * Handle the axios error response codes
 *
 * 401  =>  Redirect to sign-in router view
 * 500  =>  Throw console.log
 *
 * @param error any
 *
 * @return void
 */
export function handleErrorResponseStatus(error: any): void {
  const notificationStore = useNotificationStore()
  const { t } = useI18n()

  const errorStatus = error.response.status
  switch (errorStatus) {
    case 401:
      redirectToLogin()
      showWarningMessage(notificationStore, t('flashMessages.statusErrors.401'))
      break
    case 409:
      showWarningMessage(notificationStore, t('flashMessages.statusErrors.409'))
      break
    case 500:
      showErrorMessage(notificationStore, t('flashMessages.statusErrors.500'))
      break
  }
}

/**
 * Show a warning flash message
 *
 * @param notificationStore any
 * @param text string
 *
 * @return void
 */
function showWarningMessage(notificationStore: any, text: string): void {
  // Get the reactive flash message object
  const flashMessage = notificationStore.flashMessage
  // Set the flash message properties
  flashMessage.icon = FlashMessageIconEnum.WARNING
  flashMessage.color = FlashMessageColorEnum.WARNING
  flashMessage.text = text
  flashMessage.showFlag = true
}

/**
 * Show an error flash message
 *
 * @param notificationStore any
 * @param text string
 *
 * @return void
 */
function showErrorMessage(notificationStore: any, text: string): void {
  // Get the reactive flash message object
  const flashMessage = notificationStore.flashMessage
  // Set the flash message properties
  flashMessage.icon = FlashMessageIconEnum.ERROR
  flashMessage.color = FlashMessageColorEnum.ERROR
  flashMessage.text = text
  flashMessage.showFlag = true
}
