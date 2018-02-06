import React, { Component } from 'react';
import _ from 'lodash';
import FA from '@fortawesome/react-fontawesome';
import { faHandSpock } from '@fortawesome/fontawesome-free-solid';

/**
 * Renders an employees read-only supervisor
 * @param {Object}  supervisor  The supervisor object
 * @returns {*}     Displays read-only supervisor name
 * @constructor
 */
const Supervisor = ({supervisor}) => {
    return (
        <p id="supervisor">
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
            <div className="col">
                <label htmlFor="employees">Employees</label>
                <div>
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
    items.push((options || []).map( (option, i) => {
        return <option value={option.id} key={i}>{option.name}</option>

    }));
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
 * Form used to edit or create an employee
 * Creates or updates via EmployeeService on submission
 * @param {Object}      employee            The employee being edited
 * @param {Function}    onEmployeeChanged   Callback to update employee on root state
 * @param {Function}    onSuperSelected     Callback to update employee supervisor for dropdown selection
 * @param {Object}      supervisor          The employee's supervisor
 * @param {Object[]}    options             Available supervisors for the employee based on rank
 * @param {Function}    onSubmit            Callback to create or update employee
 * @param {Function}    onCancel            Callback to cancel form submission
 * @param {boolean}     formValid           Determines whether or not form can be submitted
 * @param {Object}      formErrors          Text errors for name, title, and rank fields
 * @returns {*}         The edit form
 */
const EditDetails = ({employee, onEmployeeChanged, onSuperSelected,
                         supervisor, options,
                         onSubmit, onCancel, formValid, formErrors}) => {

    return (
        <form className="text-left was-validated">
            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text"
                           className={"form-control" + (formErrors.name.length > 0 ? ' is-invalid' : '')}
                           name="name"
                           id="name"
                           required
                           value={employee.name}
                           onChange={(e) => onEmployeeChanged(e)}/>
                    <p className="invalid-feedback">{formErrors.name}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text"
                           className={"form-control" + (formErrors.title.length > 0 ? ' is-invalid' : '')}
                           name="title"
                           id="title"
                           required
                           value={employee.title}
                           onChange={(e) => onEmployeeChanged(e)}/>
                    <p className="invalid-feedback">{formErrors.title}</p>
                </div>
                <div className={"form-group"}>
                    <label htmlFor="rank">Rank</label>
                    <input type="number"
                           className={"form-control" + (formErrors.rank.length > 0 ? ' is-invalid' : '')}
                           name="rank"
                           id="rank" value={employee.rank}
                           required
                           onChange={(e) => onEmployeeChanged(e)}/>
                    <p className="invalid-feedback">{formErrors.rank}</p>
                </div>
                <SupervisorSelection
                    supervisor={supervisor}
                    onChange={onSuperSelected}
                    options={options}/>
            </fieldset>

            <div className="text-center">
                <button type="button"
                        className="btn btn-outline-secondary mr-3"
                        onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit"
                        className="btn btn-outline-light"
                        onClick={() => onSubmit(employee)}
                        disabled={!formValid}>
                    Save
                </button>
            </div>
        </form>
    )
};

/**
 * View showing read only details of the selected employee
 * @param {Object}      employee        The employee being viewed
 * @param {Object}      supervisor      The employee's supervisor
 * @param {Function}    editEmployee    Callback to show edit form
 * @param {Function}    onClose         Callback to close details view
 * @returns {*}         The read only details view
 * @constructor
 */
const ReadOnlyDetails = ({employee, supervisor, editEmployee, onClose}) => {
    return (
        <div className="text-center">
            <div className="row">
                <div className="col">
                    <label htmlFor="name">Name
                        <span id="name">{employee.name}</span>
                    </label>
                </div>
                <div className="col">
                    <label htmlFor="title">Title
                        <span id="title">{employee.title}</span>
                    </label>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label htmlFor="rank">Rank
                        <span id="rank">{employee.rank}</span>
                    </label>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label htmlFor="supervisor">Supervisor</label>
                    <Supervisor supervisor={supervisor} />
                </div>
                <Children employee={employee} />
            </div>

            <div className="text-center mt-3">
                <button type="button"
                        className="btn btn-outline-secondary mr-3"
                        onClick={onClose}>
                    Close
                </button>
                <button type="button"
                        className="btn btn-outline-light"
                        onClick={editEmployee}>
                    Edit
                </button>
            </div>
        </div>
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
        this.onEmployeeChanged = this.onEmployeeChanged.bind(this);
        this.editEmployee = this.editEmployee.bind(this);
        this.validateFields = this.validateFields.bind(this);

        // initialize an empty employee if creating
        const employee = !!props.employee.id ?
            props.employee :
            {name: '', title: '', rank: 1, supervisor: props.tree.id};

        this.state = {
            tree: props.tree,
            employee: employee,
            onDetailsClose: props.onDetailsClose,
            onSubmit: props.onSubmit,
            supervisor: this.findSuper(props.tree, employee.supervisor),
            options: this.findPossibleSupers(props.tree, employee.rank, employee.id),
            isEditing: false,
            formErrors: {name: '', title: '', rank: ''},
            formValid: false,
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
        else if (el.children && el.children.length > 0) {
            let supervisor;
            // check each child until a match is found
            for (let child of el.children) {
                supervisor = this.findSuper(child, supervisorId);
                if (supervisor) {
                    return supervisor;
                }
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
        // if editing, reset employee data
        // and go back to unmodified details
        if (this.state.employee.id) {
            this.setState({
                isEditing: !this.state.isEditing,
                employee: this.props.employee
            });
        }
        // else close details
        else {
            this.state.onDetailsClose();
        }

    };

    /**
     * Updates state supervisor and employee on supervisor dropdown change
     * @param {Object}  e   The event object
     */
    onSuperSelected = (e) => {
        let supervisor = this.findSuper(this.state.tree, parseInt(e.target.value));
        let employee = Object.assign({}, this.state.employee);
        employee['supervisor'] = parseInt(e.target.value);
        this.setState(() => {
            return {supervisor: supervisor, employee: employee};
        }, () => { this.validateFields(employee.rank, 'rank') });
    };

    /**
     * Updates the employee values on input change
     * @param {Object}  e   The event object
     */
    onEmployeeChanged = (e) => {
        let employee = Object.assign({}, this.state.employee);

        const property = e.target.id;
        const value = e.target.value;

        employee[property] = value;

        this.setState({employee: employee},
            () => { this.validateFields(value, property) }
        )
    };

    /**
     * Validates the employee's new rank
     * Sets rank error if new rank is greater than the supervisor's rank
     * Sets rank error if new rank is less than any child's rank
     * @param {number|string}   newValue    The field's changed value
     * @param {string}          fieldName   The field being edited
     */
    validateFields = (newValue, fieldName) => {
        let errors = this.state.formErrors;

        switch(fieldName) {
            case 'rank':
                let supervisor = this.state.supervisor;
                let employee = this.state.employee;

                // find the highest rank of employee's children
                let maxChildRank = _.max( (employee.children || []).map( (child) => {
                    return child.rank
                }));

                // if rank is greater than supervisor's
                if (!!supervisor && newValue > supervisor.rank) {
                    errors['rank'] = 'Rank cannot be greater than supervisor\'s';
                }
                // if rank is less than any child's
                else if ( newValue < maxChildRank ) {
                    errors['rank'] = 'Rank must be greater than all children';
                }
                // if rank is less than 1
                else if ( !newValue || newValue <= 0 ) {
                    errors['rank'] = 'Rank must be greater than 0';
                }
                else {
                    errors['rank'] = '';
                }
                break;
            default:
                if (!newValue || newValue.length <= 0) {
                    errors[fieldName] = 'This field is required';
                }
                else {
                    errors[fieldName] = '';
                }
        }

        // set rank error and
        this.setState({
            formErrors: errors
        }, this.validateForm);
    };

    /**
     * Determines whether or not the entire form is valid for submission
     */
    validateForm = () => {
        const isValid = this.state.formErrors.rank.length <= 0 &&
            this.state.formErrors.name.length <= 0 &&
            this.state.formErrors.title.length <= 0;

        this.setState({
            formValid: isValid
        })
    };

    render () {
        const employee = this.state.employee;
        let supervisor, details;

        // if employee already has a supervisor
        if (this.state.supervisor) {
            supervisor = this.state.supervisor;
        }
        // if selected employee is not the top of the tree
        // we assume this is then a new employee and
        // default the supervisor to the top level employee
        else if (employee.id !== this.state.tree.id) {
            supervisor = this.state.tree;
        }

        // if editing or creating, show editable form
        if (this.state.isEditing || !employee.id) {
            details = (
                <EditDetails
                    employee={employee}
                    onEmployeeChanged={this.onEmployeeChanged}
                    onSuperSelected={this.onSuperSelected}
                    supervisor={supervisor}
                    options={this.state.options}
                    onSubmit={this.state.onSubmit}
                    onCancel={this.editEmployee}
                    formValid={this.state.formValid}
                    formErrors={this.state.formErrors}
                />
            )
        }
        else {
            details = (
                <ReadOnlyDetails
                    employee={employee}
                    supervisor={supervisor}
                    editEmployee={this.editEmployee}
                    onClose={this.state.onDetailsClose}
                />
            )
        }

        return (
            <div className="details border bg-dark p-3">
                <button type="button" className="close"
                        onClick={this.state.onDetailsClose}>
                    &times;</button>
                <FA icon={faHandSpock} className="avatar mb-3" />
                {(employee) ? details : null}
            </div>
        )
    }
}