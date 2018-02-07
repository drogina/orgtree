import React, { Component } from 'react';
import _ from 'lodash';
import FA from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/fontawesome-free-solid';
import * as EmployeeService from '../../services/employee';
import Details from './Details';

/**
 * Employee
 * Renders the employee node for each employee in the organization
 * @param {Object}      employee        The current employee being rendered
 * @param {string}      rankClass       The class to append for two similarly ranked sibling emploeyes
 * @param {Function}    showDetails     Callback to show an employee's details
 * @param {Function}    deleteEmployee  Callback to delete an employee
 * @returns {*}
 * @constructor
 */
const Employee = ({employee, showDetails, deleteEmployee}) => {

    // display a horizontal line if employee and supervisor have same rank
    let rankClass = '';
    if (employee && employee.supervisorRank && employee.rank === employee.supervisorRank) {
        rankClass = 'h-line-t'
    }

    return (
        <div className="employee">
            <div className="card">
                <div className="card-block">
                    <h4 className="card-title">{employee.name}</h4>
                    <h6 className="card-subtitle mb-2 text-muted">{employee.title}</h6>
                    <p className="card-text"><strong>Rank: </strong>{employee.rank}</p>
                    <div>
                        <button className="btn btn-sm btn-link"
                                onClick={() => showDetails(employee)}>
                            <FA icon={faEye}/>
                        </button>
                        {
                            employee.children && employee.children.length <= 0 ?
                                <button className="btn btn-sm btn-link btn-trash"
                                        onClick={() => deleteEmployee(employee.id)}>
                                    <FA icon={faTrash}/>
                                </button>
                                : null
                        }
                    </div>
                </div>
            </div>
            <div className={rankClass} />
        </div>
    )
};

/**
 * OrgChart
 * Recursively traverses the organization hierarchy and
 * builds Employee component nodes for each employees' children
 * @param {Object}      tree            The organization hierarchy
 * @param {Function}    onEditClick     Displays the Details view for a given employee
 * @param {Function}    onDeleteClick   Removes a bottom node employee from the chart
 * @returns {*} Returns the built organization chart
 */
const OrgChart = ({tree, onEditClick, onDeleteClick}) => {

    /**
     *
     * @param {Object}      tree            The tree for employee node being rendered
     * @returns {*}         Employee node components for the org chart
     */
    const displayEmployees = (tree) => {

        /**
         * Returns recursive rendering for remaining children
         */
        const employees = ( (tree.children || []).map( (child, cIndex) => {
            return (
                <div className="col" key={cIndex}>
                    <div className="v-line" />
                    {displayEmployees(tree.children[cIndex])}
                </div>
            )
        }));

        console.log(tree);

        return (
            <div className="org-chart">
                <div className="row">
                    <div className="col">
                        <Employee
                            employee={tree}
                            showDetails={onEditClick}
                            deleteEmployee={onDeleteClick}
                        />
                    </div>
                </div>
                <div className="row">
                    {employees}
                </div>
            </div>
        )
    };

    return (
        <div>{displayEmployees(tree)}</div>
    );
};

/**
 * Class EmployeeList
 * Renders organization chart and Details when activated.
 */
export default class EmployeeList extends Component {

    constructor(props) {
        super(props);
        this.showDetails = this.showDetails.bind(this);
        this.hideDetails = this.hideDetails.bind(this);
        this.saveEmployee = this.saveEmployee.bind(this);
        this.deleteEmployee = this.deleteEmployee.bind(this);
        this.state = {
            tree: {},
            showDetails: false,
            detailEmployee: null,
        }
    }

    /**
     * Displays employee details for selected employee
     * @param {Object} employee     Employee whose details are being viewed
     */
    showDetails(employee) {
        this.setState({
            showDetails: true,
            detailEmployee: employee,
        });
    }

    /**
     * Hides the Details view
     */
    hideDetails() {
        this.setState({
            showDetails: false,
            detailEmployee: null,
        });
    }



    /**
     * Builds employee data and updates the employee
     * Then updates the state to re-render org chart
     * @param {Object} e            The click event
     * @param {Object} employee     Employee whose details are being updated
     * @returns {Promise<void>}
     */
    async saveEmployee(e, employee) {
        e.preventDefault();
        e.stopPropagation();
        if (employee.id) {
            await EmployeeService.update(employee.id, employee);
        }
        else {
            await EmployeeService.create(employee);
        }

        this.setState({
            showDetails: false,
            detailEmployee: null
        },this.buildTree)
    }

    /**
     * Deletes a bottom node employee from the chart
     * @param {number} employeeId   The id of the employee to delete
     * @returns {Promise<void>}     Re-renders the org chart upon deletion
     */
    async deleteEmployee(employeeId) {
        if (window.confirm('Are you sure?')) {
            await EmployeeService.destroy(employeeId);
            await this.buildTree();
        }
    }

    /**
     * Rebuild org chart and update the state
     * @returns {Promise<void>}     Re-renders the org chart upon retrieval
     */
    async buildTree() {
        let updatedTree = await this.getEmployees();
        this.setState({tree: updatedTree});
    }

    /**
     * Retrieves all employees in the organization
     * Then builds and returns a JSON tree view based on supervisor hierarchy
     * @returns {Promise<*>} The JSON organization hierarchy
     */
    async getEmployees() {
        let employees = await EmployeeService.list();

        /**
         * Build the organization supervisor hierarchy as a JSON structure
         * Beginning with the top-level supervisor (user whose supervisor is null)
         * Generates an array, children, for each employee based on supervisor value
         * @param {Object[]}    employees   An array of employee objects
         * @returns {Object}    Returns the generated JSON tree
         */
        function generateTree(employees) {
            let map = {}, tree = [], i;

            // create object of employee ids with reference to index in employee array
            for (i = 0; i < employees.length; i += 1) {
                map[employees[i].id] = i;
            }

            // append employees to supervisor children array
            for (i = 0; i < employees.length; i += 1) {
                let currEmployee = employees[i];

                // set transient supervisor rank on employee object
                let supervisorObj = _.find(employees, (e) => {
                    return e.id === currEmployee.supervisor;
                });

                if (supervisorObj) {
                    currEmployee['supervisorRank'] = supervisorObj.rank;
                }

                // if employee is not the boss
                if (currEmployee.supervisor !== null) {
                  employees[map[currEmployee.supervisor]]['children'].push(currEmployee);
                } else {
                    tree.push(currEmployee);
                }
            }

            return tree[0];
        }

        // initialize children to empty arrays
        employees = employees.data.map(function(e) {
          return _.assign(e, {children: []})
        });

        return generateTree(employees);
    }

    /**
     * Fetches all employees pre-mount to avoid re-rendering
     * Updates employee tree on the state
     * @returns {Promise<void>}
     */
    async componentWillMount() {
        await this.buildTree();
    }

    render() {
        return (
            <div>
                <button type="button"
                        className="btn btn-success btn-block btn-lg rounded-0"
                        onClick={this.showDetails}>
                    Add Employee
                </button>
                <div className="row m-3">
                    <div className="col">
                        <OrgChart
                            tree={this.state.tree}
                            onEditClick={this.showDetails}
                            onDeleteClick={this.deleteEmployee}
                        />
                    </div>
                </div>

                {
                    (this.state.showDetails) ?
                        <Details
                            tree={this.state.tree}
                            employee={this.state.detailEmployee}
                            onDetailsClose={this.hideDetails}
                            onSubmit={this.saveEmployee}
                        />
                        : null
                }
            </div>
        )
    }
}