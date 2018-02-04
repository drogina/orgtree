import axios from 'axios';
import URL from '../config/Api'

let employeeUrl = URL + '/employees/';

/**
 * Returns a list of all employees
 * @returns {Promise<Array>}
 */
export async function list() {
    return axios.get(employeeUrl);
}

/**
 * Returns an individual employee by id
 * @param {number}  employeeId   id of the employee
 * @returns {Promise<AxiosPromise<any>>}
 */
export async function get(employeeId) {
    return axios.get(employeeUrl + employeeId + '/');
}

/**
 * Updates an employee's data
 * Returns the updated employee
 * @param {number}  employeeId   id of the employee
 * @param {Object}  employee     employee data to update
 * @returns {Promise<AxiosPromise<any>>}
 */
export async function update(employeeId, employee) {
    return axios.put(employeeUrl + employeeId + '/', employee);
}

/**
 * Creates a new employee
 * Returns created employee
 * @param {Object}  employee     new employee data
 * @returns {Promise<AxiosPromise<any>>}
 */
export async function create(employee) {
    return axios.post(employeeUrl, employee);
}

/**
 * Deletes an existing employee
 * @param {number}  employeeId  id of the employee
 * @returns {Promise<AxiosPromise>}
 */
export async function destroy(employeeId) {
    return axios.delete(employeeUrl + employeeId + '/');
}