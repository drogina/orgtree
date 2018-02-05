import React, { Component } from 'react';
import _ from 'lodash';
import FA from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/fontawesome-free-solid';
import * as EmployeeService from '../../services/employee';
import Details from './Details';

/**
 * Employee
 * Renders the employee node for each employee in the organization
 * @param {Object}      employee        The current employee being rendered
 * @param {string}      rankClass       The class to append for two similarly ranked sibling emploeyes
 * @param {Function}    showDetails     Ability to show an employee's details
 * @returns {*}
 * @constructor
 */
const Employee = ({employee, rankClass, showDetails}) => {

    return (
        <div className="employee">
            <button className="btn btn-link" onClick={() => showDetails(employee)}>
                <FA icon={faEye}/>
            </button>
            <div className="card">
                <div className="card-block">
                    <h4 className="card-title">{employee.name}</h4>
                    <h6 className="card-subtitle mb-2 text-muted">{employee.title}</h6>
                    <p className="card-text"><strong>Rank: </strong>{employee.rank}</p>
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
 * @returns {*} Returns the built organization chart
 */
const OrgChart = ({tree, onEditClick}) => {

    /**
     *
     * @param {Object}      tree            The tree for employee node being rendered
     * @param {Object[]}    parentChildren  Siblings of current employee
     * @param {number}      currIndex       Index of the current child in parentChildren
     * @returns {*}         Employee node components for the org chart
     */
    const displayEmployees = (tree, parentChildren, currIndex) => {

        /**
         * Checks current employee's siblings for same rank
         * If found, returns horizontal line class to be appended to employee's node
         * @param   {number}    index   The index of current employee in parent's children
         * @returns {string}            The horizontal line class or empty string
         */
        const hasSameRankSibling = (index) => {
            if (!parentChildren || !parentChildren[index]) return '';
            return (index < (parentChildren || []).length - 1 &&
                parentChildren[index].rank === parentChildren[index+1].rank) ?
                'h-line-r ' : '';
        };

        /**
         * Returns recursive rendering for remaining children
         */
        const employees = ( (tree.children || []).map( (child, cIndex) => {
            return (
                <div className="col" key={cIndex}>
                    <div className="v-line" />
                    {displayEmployees(tree.children[cIndex],tree.children,cIndex)}
                </div>
            )
        }));

        return (
            <div className="org-chart">
                <div className="row">
                    <div className="col">
                        <Employee
                            employee={tree}
                            rankClass={hasSameRankSibling(currIndex)}
                            showDetails={onEditClick}
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
        <div>{displayEmployees(tree,null,0)}</div>
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
     * @param {Object} employee     Employee whose details are being updated
     * @returns {Promise<void>}
     */
    async saveEmployee(employee) {
        let data = {
            name: employee.name,
            title: employee.title,
            rank: employee.rank,
            supervisor: employee.supervisor
        };
        await EmployeeService.update(employee.id, data);
        let updatedTree = await this.getEmployees();
        this.setState({tree: updatedTree, showDetails: false, detailEmployee: null});
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
        let tree = await this.getEmployees();
        this.setState({tree: tree});
    }

    render() {
        return (
            <div>
                <div className="row m-3">
                    <div className="col">
                        <OrgChart
                            tree={this.state.tree}
                            onEditClick={this.showDetails}
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