import React, { Component } from 'react';
import _ from 'lodash';
import * as EmployeeService from '../../services/employee';


// employee data component
const EmployeeComponent = ({employee, rankClass}) => {
    console.log('component', employee)

    return (
        <div className="employee">
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

const OrgChart = ({tree}) => {

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
        this.state = {tree: {}}
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
            <OrgChart tree={this.state.tree} />
        )
    }
}