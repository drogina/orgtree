import React, { Component } from 'react';
import _ from 'lodash';
import FA from '@fortawesome/react-fontawesome';
import { faUserCircle, faPencilAlt, faEye } from '@fortawesome/fontawesome-free-solid';
import * as EmployeeService from '../../services/employee';


// employee details component
const Details = ({tree, employee, onDetailsClose}) => {

    const findSuper = (el, supervisorId) => {
        if (el.id === supervisorId) {
            return el;
        }
        else if (el.children) {
            let supervisor;
            for (let child of el.children) {
                supervisor = findSuper(child, supervisorId);
            }
            return supervisor;
        }
        return null;
    };

    const supervisor = (employee.supervisor) ?
        findSuper(tree, employee.supervisor)
        : null;

    return (
        <div className="col details border p-3 mr-3">
            <FA icon={faUserCircle} className="avatar text-secondary" />
            <div className="row">
                <div className="col">
                    <p className="mb-0">
                        <strong>Name: </strong>
                        {employee.name}
                    </p>
                    <p className="mb-0">
                        <strong>Title: </strong>
                        {employee.title}
                    </p>
                    <p className="mb-0">
                        <strong>Rank: </strong>
                        {employee.rank}
                    </p>
                </div>
                <div className="col">
                    {
                        supervisor ?
                            <p className="mb-0">
                                <strong>Supervisor: </strong>
                                {supervisor.name}
                            </p>
                            : null
                    }
                    {
                        (employee.children && employee.children.length > 0) ?
                            <div className="row">
                                <div className="col">
                                    <strong>Employees: </strong>
                                </div>
                                <div className="col">
                                    {
                                        (employee.children).map((child) => {
                                            return (
                                                <p className="mb-0">{child.name}</p>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            : null
                    }
                </div>
            </div>
            <button className="btn btn-default" onClick={onDetailsClose}>Close</button>
            <button className="btn btn-primary">Edit</button>
        </div>
    )
};

// employee data component
const EmployeeComponent = ({employee, rankClass, showDetails}) => {

    return (
        <div className="employee">
            <button className="btn btn-link" onClick={() => showDetails(employee)}>
                <FA icon={faEye}/>
            </button>
            <div className="card">
                <div className="card-block">
                    <h4 className="card-title">
                        <a href={"/employees/" + employee.id}>
                            {employee.name}
                        </a>
                    </h4>
                    <h6 className="card-subtitle mb-2 text-muted">{employee.title}</h6>
                    <p className="card-text"><strong>Rank: </strong>{employee.rank}</p>
                </div>
            </div>
            <div className={rankClass} />
        </div>
    )
};

const OrgChart = ({tree, onEditClick}) => {

    const displayEmployees = (tree, parentChildren, currIndex) => {

        const hasSameRankSibling = (index) => {
            if (!parentChildren || !parentChildren[index]) return '';
            return (index < (parentChildren || []).length - 1 &&
                parentChildren[index].rank === parentChildren[index+1].rank) ?
                'h-line-r ' : '';
        };

        const rankSiblings = (index) => {
            return hasSameRankSibling(index);
        };

        const employees = ( (tree.children || []).map( (child, cIndex) => {
            return (
                <div className="col">
                    <div className="v-line" />
                    {displayEmployees(tree.children[cIndex],tree.children,cIndex)}
                </div>
            )
        }));

        return (
            <div className="org-chart">
                <div className="row">
                    <div className="col">
                        <EmployeeComponent
                            employee={tree}
                            rankClass={rankSiblings(currIndex)}
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


export default class EmployeeList extends Component {

    constructor(props) {
        super(props);
        this.showDetails = this.showDetails.bind(this);
        this.hideDetails = this.hideDetails.bind(this);
        this.state = {tree: {}, showDetails: false, detailEmployee: null}
    }

    showDetails(employee) {
        this.setState({showDetails: true, detailEmployee: employee});
    }

    hideDetails() {
        this.setState({showDetails: false, detailEmployee: null});
    }

    async getEmployees() {
        let employees = await EmployeeService.list();

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

        // initialize children
        employees = employees.data.map(function(e) {
          return _.assign(e, {children: []})
        });

        return generateTree(employees);
    }

    // fetch all employees
    async componentWillMount() {
        let tree = await this.getEmployees();
        this.setState({tree});
    }

    render() {
        return (
            <div className="row">
                <div className="col">
                    <OrgChart
                        tree={this.state.tree}
                        onEditClick={this.showDetails}
                    />
                </div>

                {
                    this.state.showDetails ?
                        <Details
                            tree={this.state.tree}
                            employee={this.state.detailEmployee}
                            onDetailsClose={this.hideDetails}
                        />
                        : null}

            </div>
        )
    }
}