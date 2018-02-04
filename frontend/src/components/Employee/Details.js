import React, { Component } from 'react';
import FA from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/fontawesome-free-solid';

/**
 * Renders an employees read-only supervisor
 * @param {Object}  supervisor  The supervisor object
 * @returns {*}     Displays read-only supervisor name
 * @constructor
 */
const Supervisor = ({supervisor}) => {
    return (
        <p className="mb-0">
            <strong>Supervisor: </strong>
            {supervisor ? supervisor.name : 'None, this is the boss!'}
        </p>
    )
};

/**
 * Renders the current employee's read-only children employees
 * @param {Object}  employee    The current employee
 * @returns {*}     Displays children employees as a read-only list
 */
const Children = ({employee}) => {
    return (
        (employee.children && employee.children.length > 0) ?
            <div className="row">
                <div className="col">
                    <strong>Employees: </strong>
                </div>
                <div className="col">
                    {
                        (employee.children).map((child, i) => {
                            return (
                                <p className="mb-0" key={i}>{child.name}</p>
                            )
                        })
                    }
                </div>
            </div>
            : null
    )
};

/**
 * Renders the options for the SupervisorSelection dropdown
 * @param {Object[]}    options     The available supervisor objects
 * @returns {Array}     Displays the names of the possible supervisors for dropdown list
 */
const SupervisorOptions = ({options}) => {
    let items = [];
    (options || []).map( (option,i) => {
        items.push(
            <option value={option.id} key={i}>{option.name}</option>
        )
    });
    return items;
};

/**
 * Renders the supervisor dropdown
 * @param {Object}      supervisor  The employee's current supervisor
 * @param {Function}    onChange    On select update function
 * @param {Object[]}    options     Array of possible supervisors for current employee
 * @returns {*}         The dropdown component
 */
const SupervisorSelection = ({supervisor, onChange, options}) => {
    return (
        supervisor ?
            <div className="form-group">
                <label htmlFor="supervisor">Supervisor</label>
                <select className="form-control"
                        id="supervisor"
                        value={supervisor.id}
                        onChange={onChange}>
                    <SupervisorOptions options={options} />
                </select>
            </div>
            : null
    )
};

/**
 * Details
 * Renders employee details and editing view
 */
export default class Details extends Component {
    constructor(props) {
        super(props);
        this.onSuperSelected = this.onSuperSelected.bind(this);

        this.state = {
            tree: props.tree,
            employee: props.employee,
            onDetailsClose: props.onDetailsClose,
            onSubmit: props.onSubmit,
            supervisor: (props.employee.supervisor) ?
                this.findSuper(props.tree, props.employee.supervisor) :
                null,
            options: this.findPossibleSupers(props.tree, props.employee.rank, props.employee.id),
            isEditing: false,
        };
    }

    /**
     * Finds and returns an employee's current supervisor
     * @param {Object}  el              The organization tree to search
     * @param {number}  supervisorId    The current employee's supervisor id
     * @returns {Object}                The current employee's supervisor node
     */
    findSuper = (el, supervisorId) => {
        // supervisor node found
        if (el.id === supervisorId) {
            return el;
        }
        // node has children
        else if (el.children) {
            let supervisor;
            // check each child for match
            for (let child of el.children) {
                supervisor = this.findSuper(child, supervisorId);
            }
            return supervisor;
        }
        return null;
    };

    /**
     * Finds and returns an array of higher or equal
     * ranked employees for a given employee
     * @param {Object}  el      The organization tree to search
     * @param {number}  rank    The current employee's rank
     * @param {number}  id      The current employee's id
     * @returns {Array}         Higher or equal ranked employees
     */
    findPossibleSupers = (el, rank, id) => {
        let supers = [];
        // current node rank lower or node is current employee
        if (el.rank < rank || el.id === id) {
            return supers;
        }
        // node has children
        else if (el.children) {
            // add the current node to the return array
            supers = supers.concat([{id: el.id, name: el.name}]);
            // check each child for possible supers
            for (let child of el.children) {
                supers = supers.concat(this.findPossibleSupers(child, rank, id));
            }
        }
        return supers;
    };

    /**
     * Allow editing of employee
     */
    editEmployee = () => {
        this.setState({
            isEditing: true
        })
    };

    /**
     * Updates state supervisor and employee on supervisor dropdown change
     * @param {Object}  e   The event object
     */
    onSuperSelected = (e) => {
        let supervisor = this.findSuper(this.state.tree, parseInt(e.target.value));
        let employee = Object.assign({}, this.state.employee);
        employee['supervisor'] = parseInt(e.target.value);
        this.setState({
            supervisor, employee
        });
    };

    /**
     * Updates the employee values on input change
     * @param {string}  property    The employee field being updated
     * @param {Object}  e           The event object
     */
    onEmployeeChanged = (property, e) => {
        let employee = Object.assign({}, this.state.employee);
        employee[property] = e.target.value;
        this.setState({employee})
    };

    render () {
        const employee = this.state.employee;
        return (
            <div className="col details border p-3 mr-3">
                <FA icon={faUserCircle} className="avatar text-secondary" />
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text"
                               className="form-control"
                               id="name"
                               value={employee.name}
                               onChange={(e) => this.onEmployeeChanged('name', e)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text"
                               className="form-control"
                               id="title"
                               value={employee.title}
                               onChange={(e) => this.onEmployeeChanged('title', e)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rank">Rank</label>
                        <input type="number"
                               className="form-control"
                               id="rank" value={employee.rank}
                               onChange={(e) => this.onEmployeeChanged('rank', e)}/>
                    </div>
                    <SupervisorSelection
                        supervisor={this.state.supervisor}
                        onChange={this.onSuperSelected}
                        options={this.state.options}/>
                </form>
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
                        <Supervisor supervisor={this.state.supervisor} />
                        <Children employee={this.state.employee}/>
                    </div>
                </div>
                <button className="btn btn-default" onClick={this.state.onDetailsClose}>Close</button>
                <button className="btn btn-primary" onClick={this.editEmployee}>Edit</button>
                <button className="btn btn-primary" onClick={() => this.state.onSubmit(employee)}>Save</button>
            </div>
        )
    }
}