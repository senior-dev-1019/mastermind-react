import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import 'bootstrap/dist/css/bootstrap.min.css';
import {CompactPicker} from 'react-color';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import styles from './ShiftManager-jss';
import Swal from 'sweetalert2';
import {Helmet} from 'react-helmet'
import {
    AppBar,
    Dialog,
    IconButton, Toolbar, Typography
} from '@material-ui/core'
import {ALL_USERS_URL, ADD_SHIFT_MANAGER, GET_SHIFTS, DELETE_SHIFTS} from '../../redux/actions/adminRoutes'
import {request} from '../../utils/request'
import {getCookie} from "../../utils/cookie";

class ShiftManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalActive: false,
            hasManagingRole: false,
            isDeleteModalActive: false,
            isTemporaryScheduleActive: false,
            date: [new Date(), new Date()],
            isVisibleSecondShift: true,
            isVisibleThirdShift: false,
            isTemporaryShift: false,
            showUserScheduleModal: false,
            shiftsAreLoaded: false,
            isEditScheduleOpen: false,
            color: null,
            users: {},
            default: {},
            normal: {},
            temporary: {}
        }
        this.getAllShifts();
        this.toggleModal = this.toggleModal.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.handleUserSelection = this.handleUserSelection.bind(this);
        this.incrementSchedule = this.incrementSchedule.bind(this);
        this.decrementSchedule = this.decrementSchedule.bind(this);
        this.addShift = this.addShift.bind(this);
        this.deleteShift = this.deleteShift.bind(this);
        this.toggleTemporaryShift = this.toggleTemporaryShift.bind(this);
        this.toggleUserSchedule = this.toggleUserSchedule.bind(this);
        this.colorChangeHandler = this.colorChangeHandler.bind(this);
        this.toggleColorPicker = this.toggleColorPicker.bind(this);
        this.submitSaveSchedule = this.submitSaveSchedule.bind(this);
        this.editSchedule = this.editSchedule.bind(this);
        this.formatNumber = this.formatNumber.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
        this.calculateRange = this.calculateRange.bind(this);
        this.getWeekDays = this.getWeekDays.bind(this);
        this.getModalWidthDays = this.getModalWidthDays.bind(this);
        this.getFillSaveButtonWidthMargin = this.getFillSaveButtonWidthMargin.bind(this);
        this.getDiffInDays = this.getDiffInDays.bind(this);
        this.resolveActiveSchedule = this.resolveActiveSchedule.bind(this);
        this.israelTimeFormat = this.israelTimeFormat.bind(this);
        this.generateColorPickerColor = this.generateColorPickerColor.bind(this);
        this.findUser = this.findUser.bind(this);
    }

    israelTimeFormat(hour, minutes) {
        return moment(hour + ':' + minutes, 'H:mm').utcOffset('-04:00').format('HH:mm')
    }

    resolveActiveSchedule() {
        if(Object.keys(this.state.temporary).length > 0) {
            this.setState({isTemporaryScheduleActive : moment(new Date()).isBetween(this.state.date[0], this.state.date[1], 'day', '[]')})
        }
        else {
            this.setState({isTemporaryScheduleActive : false})
        }
    }

    getDiffInDays() {
        return moment(this.state.date[1]).diff(this.state.date[0], 'days');
    }

    getModalWidthDays() {
        if(this.state.isTemporaryShift) {
            let value = Math.abs(this.getDiffInDays());
            return value === 6 ? '1470px' : value === 5 ? '1300px' : value === 4 ? '1150px' :
                value === 3 ? '980px' : value === 2 ? '840px' : value === 1 ? '665px' : '600px';
        }
        return '1470px';
    }

    getFillSaveButtonWidthMargin() {
        if(this.state.isTemporaryShift) {
            let value = Math.abs(this.getDiffInDays());
            return value === 6 ? '110%' : value === 5 ? '100%' :
                value === 4 ? '85%' : value === 3 ? '70%' : value === 2 ? '50%' : '35%';
        }

        return '110%';
    }

    calculateRange(start, end, daysFormat = null, isForTableHeader = false) {
        const startDate = moment(start, 'YYYY-MM-DD');
        const endDate   = moment(end, 'YYYY-MM-DD');
        const range = moment.range(startDate, endDate);
        let values = Array.from(range.by('day'));

        if(daysFormat) {
            let dates = [];
            values.forEach(function (day) {
                if(isForTableHeader) {
                    let formattedDay = day.format('dddd') + ' ' + day.format('DD-MM-YY')
                    dates.push(formattedDay)
                }
                else {
                    dates.push(day.format('dddd').toLowerCase())
                }
            });
            return dates
        }
        return values.map(m => m.format('YYYY-MM-DD'))
    }

    getWeekDays(isForTemporaryScheduleTable = false, isForTableHeader = false) {
        if(isForTemporaryScheduleTable || this.state.isTemporaryShift) {
            return this.calculateRange(this.state.date[0], this.state.date[1], true, isForTableHeader)
        }
        return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }

    onDateChange(e) {
        if(moment(e[1]).diff(e[0], 'days') >= 7) {
            this.setState({isModalActive : false})
            Swal.fire(
                'Warning!',
                'You can\'t select more than 7 days!',
                'warning'
            ).then((value) => {
                this.setState({isModalActive : true})
            })
        }
        else {
            this.setState({date: e});
        }
    }

    addShift() {
        if (this.state.isVisibleSecondShift) {
            this.setState({isVisibleThirdShift: true});
        } else {
            this.setState({isVisibleSecondShift: true});
        }
    }

    deleteShift(shift) {
        if (shift === 'secondShift') {
            this.setState({isVisibleSecondShift: false});
        }
        if (shift === 'thirdShift') {
            this.setState({isVisibleThirdShift: false});
        }
    }

    submitSaveSchedule() {
        // format payload
        let shifts = {};
        shifts.firstShift = this.state.default.firstShift;
        if (this.state.isVisibleSecondShift) {
            shifts.secondShift = this.state.default.secondShift;
        }
        if (this.state.isVisibleThirdShift) {
            shifts.thirdShift = this.state.default.thirdShift;
        }

        let tempDate = null;
        if (this.state.isTemporaryShift) {
            tempDate = this.state.date

            // cut days that are not set
            shifts.firstShift.monday.hidden = true;
            shifts.firstShift.monday.hidden = true;
        }

        let payload = {
            shifts: shifts,
            temp_date: tempDate
        };

        // resolve shift
        this.resolveShifts(payload);
    }

    resolveShifts(payload) {
        this.setState({shiftsAreLoaded: false});
        request(ADD_SHIFT_MANAGER, {
            payload: payload
        }).then(response => {
            if(response.status === 200) {
                if(response.data.hasOwnProperty('normal')) {
                    this.setState({normal: response.data.normal});
                }
                if(response.data.hasOwnProperty('temporary')) {
                    this.setState({temporary: response.data.temporary});
                }
                this.setState({shiftsAreLoaded: true});

                this.setState(state => ({
                    showUserScheduleModal: false
                }));

                this.setState(state => ({
                    isModalActive: false
                }));

                this.resolveActiveSchedule();

                Swal.fire(
                    'Success!',
                    'Your schedule was updated!',
                    'success'
                )
            }
        });
    }

    getAllShifts() {
        this.setState({shiftsAreLoaded: false});
        request(GET_SHIFTS, {})
            .then(response => {
                this.setState({default: response.data.default});
                this.setState({hasManagingRole: this.props.user._root.entries[4][1] === 2 || this.props.user._root.entries[4][1] === 10});
                if(response.data.hasOwnProperty('normal')) {
                    this.setState({normal: response.data.normal});
                }

                if(response.data.hasOwnProperty('temporary')) {
                    this.setState({temporary: response.data.temporary});
                    this.setState({date: [new Date(response.data.temporary.active_from), new Date(response.data.temporary.active_to)]});
                }

                this.setState({shiftsAreLoaded: true});

                this.resolveActiveSchedule();

                this.israelTimeFormat();
            });
    }

    colorChangeHandler(color, userId) {
        let selectedUser = this.findUser(userId);
        selectedUser.color = color.hex;
        let that = this;
        Object.keys(that.state.default).forEach(function (shiftKey) {
            if (shiftKey === 'firstShift' || shiftKey === 'secondShift' || shiftKey === 'thirdShift') {
                Object.keys(that.state.default[shiftKey]).forEach(function (key) {
                    if(that.state.default[shiftKey][key].user && (that.state.default[shiftKey][key].user.id === userId))
                    {
                        that.hideAllColorPickers();
                        that.setState(prevState => ({
                            default: {
                                ...prevState.default,
                                [shiftKey]: {
                                    ...prevState.default[shiftKey],
                                    [key]: {
                                        ...prevState.default[shiftKey][key],
                                        user: selectedUser
                                    }
                                }
                            }
                        }));
                    }
                });
            }
        });
    }

    toggleColorPicker(shift, day) {
        // close all color pickers
        this.hideAllColorPickers();

        this.setState(prevState => ({
            default: {
                ...prevState.default,
                [shift]: {
                    ...prevState.default[shift],
                    [day]: {
                        ...prevState.default[shift][day],
                        isVisibleColorPicker: !this.state.default[shift][day].isVisibleColorPicker
                    }
                }
            }
        }))
    }

    hideAllColorPickers() {
        let that = this;
        Object.keys(this.state.default).forEach(function (shiftKey) {
            if (shiftKey === 'firstShift' || shiftKey === 'secondShift' || shiftKey === 'thirdShift') {
                Object.keys(that.state.default[shiftKey]).forEach(function (key) {
                    if (that.state.default[shiftKey][key].hasOwnProperty('isVisibleColorPicker')) {
                        that.setState(prevState => ({
                            default: {
                                ...prevState.default,
                                [shiftKey]: {
                                    ...prevState.default[shiftKey],
                                    [key]: {
                                        ...prevState.default[shiftKey][key],
                                        isVisibleColorPicker: false
                                    }
                                }
                            }
                        }));
                    }
                });
            }
        });
    }

    getAllUsers() {
        request(ALL_USERS_URL, {})
            .then(response => {
                if (response.data.status) {
                    // filter users
                    let filteredUsers = [];
                    let that = this;
                    response.data.users.forEach(function (user) {
                        if (user.role === 1 || user.role === 2 || user.role === 10) {
                            user.color = that.generateColorPickerColor();
                            filteredUsers.push(user)
                        }
                    });

                    // set default user foreach shift
                    Object.keys(this.state.default).forEach(function (shiftKey) {
                        if (shiftKey === 'firstShift' || shiftKey === 'secondShift' || shiftKey === 'thirdShift') {
                            Object.keys(that.state.default[shiftKey]).forEach(function (key) {
                                if (key !== 'from' && key !== 'to') {
                                    that.setState(prevState => ({
                                        default: {
                                            ...prevState.default,
                                            [shiftKey]: {
                                                ...prevState.default[shiftKey],
                                                [key]: {
                                                    ...prevState.default[shiftKey][key],
                                                    user: filteredUsers[0]
                                                }
                                            }
                                        }
                                    }));
                                }
                            });
                        }
                    });

                    // set users
                    this.setState({users: filteredUsers});
                }
            })
    }

    generateColorPickerColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    findUser(userId) {
        if(userId !== 'undefined') {
            let foundUser = null;
            let that = this;
            this.state.users.map(function (user) {
                if(user.id == userId) {
                    that.foundUser = user;
                }
            });

            return this.foundUser
        }
    }

    handleUserSelection(shift, day, e) {
        let userData = this.findUser(e.target.value);
        this.setState(prevState => ({
            default: {
                ...prevState.default,
                [shift]: {
                    ...prevState.default[shift],
                    [day]: {
                        ...prevState.default[shift][day],
                        user: userData
                    }
                }
            }
        }));
    }

    incrementSchedule(shift, direction, time) {
        this.setState(prevState => ({
            default: {
                ...prevState.default,
                [shift]: {
                    ...prevState.default[shift],
                    [direction]: {
                        ...prevState.default[shift][direction],
                        [time]: this.formatNumber('increment', time, this.state.default[shift][direction][time])
                    }
                }
            }
        }));
    }

    decrementSchedule(shift, direction, time) {
        this.setState(prevState => ({
            default: {
                ...prevState.default,
                [shift]: {
                    ...prevState.default[shift],
                    [direction]: {
                        ...prevState.default[shift][direction],
                        [time]: this.formatNumber('decrement', time, this.state.default[shift][direction][time])
                    }
                }
            }
        }));
    }

    formatNumber(action, time, value) {
        var formattedValue = 0;
        if (action === 'increment') {
            if (time === 'hour') {
                if (parseInt(value) === 23) {
                    formattedValue = 0
                } else {
                    formattedValue = parseInt(value) + 1
                }
            } else {
                if (parseInt(value) === 59) {
                    formattedValue = 0
                } else {
                    formattedValue = parseInt(value) + 1
                }
            }
        } else {
            if (time === 'hour') {
                if (parseInt(value) === 0) {
                    formattedValue = 23
                } else {
                    formattedValue = parseInt(value) - 1
                }
            } else {
                if (parseInt(value) === 0) {
                    formattedValue = 59
                } else {
                    formattedValue = parseInt(value) - 1
                }
            }
        }

        if (formattedValue >= 10) {
            return formattedValue.toString()
        } else {
            return '0' + formattedValue.toString()
        }
    }

    toggleModal() {
        this.setState(state => ({
            isModalActive: !state.isModalActive
        }));

        if(Object.entries(this.state.users).length === 0) {
            this.getAllUsers();
        }

        this.setState({isEditScheduleOpen: false});
    }

    resolve(shiftType) {
        if(shiftType === 'normal') {
            this.setState(state => ({default: state.normal}));

            this.setState({isTemporaryShift : false});

            this.setState({isVisibleSecondShift: this.state.normal.secondShift ? true : false});
            this.setState({isVisibleThirdShift: this.state.normal.thirdShift ? true : false});
        }
        else {
            this.setState(state => ({default: state.temporary}));

            this.setState({isTemporaryShift : true});

            this.setState({isVisibleSecondShift: this.state.temporary.secondShift ? true : false});
            this.setState({isVisibleThirdShift: this.state.temporary.thirdShift ? true : false});
        }

        // add default data for third shift in case of edit has 2
        let that = this;
        var timeoutHandle = setTimeout(function() {
            if(that.state.users) {
                if(that.state.isVisibleSecondShift && !that.state.isVisibleThirdShift) {
                    that.setState(prevState => ({
                        default: {
                            ...prevState.default,
                            thirdShift: that.returnDefaultShiftData()
                        }
                    }));
                }
                if(!that.state.isVisibleSecondShift && !that.state.isVisibleThirdShift) {
                    that.setState(prevState => ({
                        default: {
                            ...prevState.default,
                            secondShift: that.returnDefaultShiftData()
                        }
                    }));
                    that.setState(prevState => ({
                        default: {
                            ...prevState.default,
                            thirdShift: that.returnDefaultShiftData()
                        }
                    }));
                }
                clearTimeout(timeoutHandle);
            }
        }, 400)
    }

    editSchedule(shiftType) {
        if(Object.entries(this.state.users).length === 0) {
            this.getAllUsers();
        }

        this.resolve(shiftType);
        this.setState({isEditScheduleOpen: true});
        let that = this;
        setTimeout(function() {
            that.resolve(shiftType);

            that.setState(state => ({
                isModalActive: !state.isModalActive
            }));

        }, 500)

    }

    deleteSchedule(shiftType) {
        const that = this;
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to remove this schedule!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                request(DELETE_SHIFTS, {shiftType: shiftType})
                    .then(response => {
                        that.setState(prevState => ({
                            default: {
                                ...prevState.default,
                                firstShift: that.returnDefaultShiftData(),
                                secondShift: that.returnDefaultShiftData(),
                                thirdShift: that.returnDefaultShiftData()
                            }
                        }));
                        this.setState(state => ({
                            isTemporaryShift: false
                        }));
                        if(shiftType === 'normal') {
                            that.setState({normal: {}});
                        }
                        if(shiftType === 'temporary') {
                            that.setState({temporary: {}});
                        }
                        Swal.fire(
                            'Deleted!',
                            'The schedule has been deleted.',
                            'success'
                        )

                        this.resolveActiveSchedule();
                    });
            }
        })
    }

    returnDefaultShiftData() {
        return {
            from: {
                hour: '09',
                min: '00'
            },
            to: {
                hour: '09',
                min: '00'
            },
            monday: {
                user: this.state.users[0],
                isVisibleColorPicker: false
            },
            tuesday: {
                user: this.state.users[0],
                isVisibleColorPicker: false
            },
            wednesday: {
                user: this.state.users[0],
                isVisibleColorPicker: false
            },
            thursday: {
                user: this.state.users[0],
                isVisibleColorPicker: false
            },
            friday: {
                user: this.state.users[0],
                isVisibleColorPicker: false
            },
            saturday: {
                user: this.state.users[0],
                isVisibleColorPicker: false
            },
            sunday: {
                user: this.state.users[0],
                isVisibleColorPicker: false
            }
        }
    }

    toggleTemporaryShift() {
        this.setState(state => ({
            isTemporaryShift: !state.isTemporaryShift
        }));
    }

    toggleUserSchedule() {
        this.setState(state => ({
            showUserScheduleModal: !state.showUserScheduleModal
        }));

        this.hideAllColorPickers();
    }

    render() {
        const {classes} = this.props;
        return (
            <div className="shift-manager">

                <Helmet>
                    <title>Shift Manager</title>
                    <link rel="icon" href="/images/logo.png" sizes="32x32"/>
                </Helmet>
                {this.state.isModalActive}
                <div className={classes.container} style={{minHeight: '700px'}}>
                    {(!this.state.normal.firstShift || !this.state.temporary.firstShift) && this.state.hasManagingRole && <button type="button" style={{marginBottom: '30px'}} className="btn btn-success" onClick={this.toggleModal}>New schedule</button>}

                    {Object.keys(this.state.normal).length > 0 && this.state.shiftsAreLoaded &&
                        <section className={this.state.isTemporaryScheduleActive ? ' inactive' : ' active'} style={{marginTop: '60px'}}>
                            {this.state.hasManagingRole && <i onClick={() => this.editSchedule('normal')}
                               className="fa fa-edit"  title="Key" style={{
                                fontSize: '24px',
                                float: 'right',
                                marginTop: '-35px',
                                marginRight: '30px'
                            }}></i>}

                            {this.state.hasManagingRole && <i onClick={() => this.deleteSchedule('normal')}
                               className="fa fa-trash" title="Key" style={{
                                fontSize: '24px',
                                float: 'right',
                                marginTop: '-35px'
                            }}></i>}

                    <table className="table table-bordered shift">
                        <thead>
                        <tr>
                            <th scope="col" style={{ width: '300px'}}>Shift</th>
                            <th scope="col" style={{ width: '170px'}}>Monday</th>
                            <th scope="col" style={{ width: '170px'}}>Tuesday</th>
                            <th scope="col" style={{ width: '170px'}}>Wednesday</th>
                            <th scope="col" style={{ width: '170px'}}>Thursday</th>
                            <th scope="col" style={{ width: '170px'}}>Friday</th>
                            <th scope="col" style={{ width: '170px'}}>Saturday</th>
                            <th scope="col" style={{ width: '170px'}}>Sunday</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state.normal.firstShift ? <tr>
                                <td style={{fontWeight: '500', fontSize: '15px'}} scope="row">
                                    {this.state.normal.firstShift.from.hour}:{this.state.normal.firstShift.from.min}-{this.state.normal.firstShift.to.hour}:{this.state.normal.firstShift.to.min} ({this.israelTimeFormat(this.state.normal.firstShift.from.hour, this.state.normal.firstShift.from.min)}-{this.israelTimeFormat(this.state.normal.firstShift.to.hour, this.state.normal.firstShift.to.min)} Israel)
                                </td>
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(function (day) {
                                    return <td style={{background: this.state.normal.firstShift[day].user.color}} key={day}>
                                        {this.state.normal.firstShift[day].user.name}
                                    </td>
                                }, this)}
                            </tr> : null}

                            {this.state.normal.secondShift ? <tr>
                                <td style={{fontWeight: '500', fontSize: '15px'}} scope="row">
                                    {this.state.normal.secondShift.from.hour}:{this.state.normal.secondShift.from.min}-{this.state.normal.secondShift.to.hour}:{this.state.normal.secondShift.to.min} ({this.israelTimeFormat(this.state.normal.secondShift.from.hour, this.state.normal.secondShift.from.min)}-{this.israelTimeFormat(this.state.normal.secondShift.to.hour, this.state.normal.secondShift.to.min)} Israel)
                                </td>
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(function (day) {
                                    return <td style={{background: this.state.normal.secondShift[day].user.color}} key={day}>
                                        {this.state.normal.secondShift[day].user.name}
                                    </td>
                                }, this)}
                            </tr> : null}

                            {this.state.normal.thirdShift ? <tr>
                                <td style={{fontWeight: '500', fontSize: '15px'}} scope="row">
                                    {this.state.normal.thirdShift.from.hour}:{this.state.normal.thirdShift.from.min}-{this.state.normal.thirdShift.to.hour}:{this.state.normal.thirdShift.to.min} ({this.israelTimeFormat(this.state.normal.thirdShift.from.hour, this.state.normal.thirdShift.from.min)}-{this.israelTimeFormat(this.state.normal.thirdShift.to.hour, this.state.normal.thirdShift.to.min)} Israel)
                                </td>
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(function (day) {
                                    return <td style={{background: this.state.normal.thirdShift[day].user.color}} key={day}>
                                        {this.state.normal.thirdShift[day].user.name}
                                    </td>
                                }, this)}
                            </tr> : null}
                        </tbody>
                    </table></section>}

                    {Object.keys(this.state.temporary).length > 0 && this.state.shiftsAreLoaded &&
                    <section>
                        <h4 style={{margin: '40px 0 10px 0'}}>Temporary schedule</h4>
                        {this.state.hasManagingRole && <i onClick={() => this.editSchedule('temporary')}
                           className="fa fa-edit"  title="Key" style={{
                            fontSize: '24px',
                            float: 'right',
                            marginTop: '-35px',
                            marginRight: '30px'
                        }}></i>}

                        {this.state.hasManagingRole && <i onClick={() => this.deleteSchedule('temporary')}
                           className="fa fa-trash" title="Key" style={{
                            fontSize: '24px',
                            float: 'right',
                            marginTop: '-35px'
                        }}></i>}

                        <section className={this.state.isTemporaryScheduleActive ? ' active' : ' inactive'}>
                        <table className="table table-bordered shift temporary-schedule-table">
                            <thead>
                            <tr>
                                <th scope="col" style={{width: '300px'}}>Shift</th>
                                {this.getWeekDays(true, true).map(function(day) {
                                    return <th style={{width: '190px'}} className="weekdays" scope="col" key={day}>{day}</th>
                                })}
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.temporary.firstShift ? <tr>
                                <td style={{fontWeight: '500', fontSize: '15px'}} scope="row">
                                    {this.state.temporary.firstShift.from.hour}:{this.state.temporary.firstShift.from.min}-{this.state.temporary.firstShift.to.hour}:{this.state.temporary.firstShift.to.min} ({this.israelTimeFormat(this.state.temporary.firstShift.from.hour, this.state.temporary.firstShift.from.min)}-{this.israelTimeFormat(this.state.temporary.firstShift.to.hour, this.state.temporary.firstShift.to.min)} Israel)
                                </td>
                                {this.getWeekDays(true).map(function (day) {
                                    return <td style={{background: this.state.temporary.firstShift[day].user.color}} key={day}>
                                        {this.state.temporary.firstShift[day].user.name}
                                    </td>
                                }, this)}
                            </tr> : null}

                            {this.state.temporary.secondShift ? <tr>
                                <td style={{fontWeight: '500', fontSize: '15px'}} scope="row">
                                    {this.state.temporary.secondShift.from.hour}:{this.state.temporary.secondShift.from.min}-{this.state.temporary.secondShift.to.hour}:{this.state.temporary.secondShift.to.min} ({this.israelTimeFormat(this.state.temporary.secondShift.from.hour, this.state.temporary.secondShift.from.min)}-{this.israelTimeFormat(this.state.temporary.secondShift.to.hour, this.state.temporary.secondShift.to.min)} Israel)
                                </td>
                                {this.getWeekDays(true).map(function (day) {
                                    return <td style={{background: this.state.temporary.secondShift[day].user.color}} key={day}>
                                        {this.state.temporary.secondShift[day].user.name}
                                    </td>
                                }, this)}
                            </tr> : null}

                            {this.state.temporary.thirdShift ? <tr>
                                <td style={{fontWeight: '500', fontSize: '15px'}} scope="row">
                                    {this.state.temporary.thirdShift.from.hour}:{this.state.temporary.thirdShift.from.min}-{this.state.temporary.thirdShift.to.hour}:{this.state.temporary.thirdShift.to.min} ({this.israelTimeFormat(this.state.temporary.thirdShift.from.hour, this.state.temporary.thirdShift.from.min)}-{this.israelTimeFormat(this.state.temporary.thirdShift.to.hour, this.state.temporary.thirdShift.to.min)} Israel)
                                </td>
                                {this.getWeekDays(true).map(function (day) {
                                    return <td style={{background: this.state.temporary.thirdShift[day].user.color}} key={day}>
                                        {this.state.temporary.thirdShift[day].user.name}
                                    </td>
                                }, this)}
                            </tr> : null}
                            </tbody>
                        </table>
                        </section>
                    </section>}


                    {this.state.isModalActive && (<Dialog
                        open={this.state.isModalActive}
                        fullWidth
                        PaperProps={{
                            style: {
                                maxHeight: '430px',
                                overflowY: 'hidden'
                            },
                        }}
                    >
                        <AppBar position="static">
                            <Toolbar className={classes.centerItems}>
                                <Typography variant="h6" className={classes.title}
                                            style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                                    New schedule
                                </Typography>

                                <IconButton aria-label="close" className={classes.closeButton}
                                            onClick={this.toggleModal}>
                                    <i className="fa fa-times" title="Key"></i>
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <div className={classes.modalContent}>
                            <div className="form-check">
                                <form className="addNewShiftSchedule">
                                    <div className="temporaySchedule">
                                        <div className="boxes">
                                            <input onChange={this.toggleTemporaryShift} checked={this.state.isTemporaryShift} type="checkbox" id="box-1"/>
                                            <label style={!this.state.isTemporaryShift ? {opacity: '0.5'} : {}}
                                                   htmlFor="box-1">Set temporal schedule</label>
                                        </div>

                                        {this.state.isTemporaryShift &&
                                        <DateRangePicker onChange={this.onDateChange} value={this.state.date}/>}
                                    </div>

                                    <div style={{marginTop: '35px'}}>
                                        <h4>1 shift hours</h4>
                                        <div className={classes.number}>
                                            <div className="from">
                                                <i onClick={() => this.incrementSchedule('firstShift', 'from', 'hour')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span
                                                    className="{number}">{this.state.default.firstShift.from.hour}</span>
                                                <i onClick={() => this.decrementSchedule('firstShift', 'from', 'hour')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                                <span> : </span>
                                                <i onClick={() => this.incrementSchedule('firstShift', 'from', 'min')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span
                                                    className="{number}">{this.state.default.firstShift.from.min}</span>
                                                <i onClick={() => this.decrementSchedule('firstShift', 'from', 'min')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                            </div>

                                            <hr className="newScheduleDivider"></hr>

                                            <div className="to">
                                                <i onClick={() => this.incrementSchedule('firstShift', 'to', 'hour')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span
                                                    className="{number}">{this.state.default.firstShift.to.hour}</span>
                                                <i onClick={() => this.decrementSchedule('firstShift', 'to', 'hour')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                                <span> : </span>
                                                <i onClick={() => this.incrementSchedule('firstShift', 'to', 'min')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span className="{number}">{this.state.default.firstShift.to.min}</span>
                                                <i onClick={() => this.decrementSchedule('firstShift', 'to', 'min')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                            </div>
                                        </div>
                                    </div>

                                    {this.state.isVisibleSecondShift && <div style={{marginTop: '35px'}}>
                                        <h4>2 shift hours</h4>
                                        <div className={classes.number}>
                                            <div className="from">
                                                <i onClick={() => this.incrementSchedule('secondShift', 'from', 'hour')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span
                                                    className="{number}">{this.state.default.secondShift.from.hour}</span>
                                                <i onClick={() => this.decrementSchedule('secondShift', 'from', 'hour')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                                <span> : </span>
                                                <i onClick={() => this.incrementSchedule('secondShift', 'from', 'min')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span
                                                    className="{number}">{this.state.default.secondShift.from.min}</span>
                                                <i onClick={() => this.decrementSchedule('secondShift', 'from', 'min')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                            </div>

                                            <hr className="newScheduleDivider"></hr>

                                            <div className="to">
                                                <i onClick={() => this.incrementSchedule('secondShift', 'to', 'hour')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span
                                                    className="{number}">{this.state.default.secondShift.to.hour}</span>
                                                <i onClick={() => this.decrementSchedule('secondShift', 'to', 'hour')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                                <span> : </span>
                                                <i onClick={() => this.incrementSchedule('secondShift', 'to', 'min')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span
                                                    className="{number}">{this.state.default.secondShift.to.min}</span>
                                                <i onClick={() => this.decrementSchedule('secondShift', 'to', 'min')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                            </div>
                                            {!this.state.isVisibleThirdShift &&
                                            <button onClick={() => this.deleteShift('secondShift')} type="button"
                                                    className="btn btn-danger btn-sm deleteShift"><i
                                                className="fa fa-times" title="Key"></i></button>}
                                        </div>
                                    </div>}

                                    {this.state.isVisibleThirdShift && <div style={{marginTop: '35px'}}>
                                        <h4>3 shift hours</h4>
                                        <div className={classes.number}>
                                            <div className="from">
                                                <i onClick={() => this.incrementSchedule('thirdShift', 'from', 'hour')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span
                                                    className="{number}">{this.state.default.thirdShift.from.hour}</span>
                                                <i onClick={() => this.decrementSchedule('thirdShift', 'from', 'hour')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                                <span> : </span>
                                                <i onClick={() => this.incrementSchedule('thirdShift', 'from', 'min')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span
                                                    className="{number}">{this.state.default.thirdShift.from.min}</span>
                                                <i onClick={() => this.decrementSchedule('thirdShift', 'from', 'min')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                            </div>

                                            <hr className="newScheduleDivider"></hr>

                                            <div className="to">
                                                <i onClick={() => this.incrementSchedule('thirdShift', 'to', 'hour')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span
                                                    className="{number}">{this.state.default.thirdShift.to.hour}</span>
                                                <i onClick={() => this.decrementSchedule('thirdShift', 'to', 'hour')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                                <span> : </span>
                                                <i onClick={() => this.incrementSchedule('thirdShift', 'to', 'min')}
                                                   className="fa fa-angle-up"
                                                   style={{marginTop: '-13px', marginLeft: '3px', position: 'absolute'}}
                                                   title="Key"></i>
                                                <span className="{number}">{this.state.default.thirdShift.to.min}</span>
                                                <i onClick={() => this.decrementSchedule('thirdShift', 'to', 'min')}
                                                   className="fa fa-angle-down" style={{
                                                    marginTop: '20px',
                                                    marginLeft: '-13px',
                                                    position: 'absolute'
                                                }} title="Key"></i>
                                            </div>
                                            <button onClick={() => this.deleteShift('thirdShift')} type="button"
                                                    className="btn btn-danger btn-sm deleteShift"><i
                                                className="fa fa-times" title="Key"></i></button>
                                        </div>
                                    </div>}

                                    {!this.state.isVisibleThirdShift &&
                                    <button onClick={this.addShift} type="button" className="btn btn-warning btn-sm"
                                            style={{marginTop: '20px'}}>Add shift</button>}
                                    {(Object.keys(this.state.normal).length === 0 || this.state.isTemporaryShift || this.state.isEditScheduleOpen)
                                    && (Object.keys(this.state.temporary).length === 0 || !this.state.isTemporaryShift || this.state.isEditScheduleOpen) && <div>
                                        <button type="button" onClick={this.toggleUserSchedule}
                                                className="btn btn-success"
                                                style={{
                                                    textAlign: 'center',
                                                    marginLeft: 'auto',
                                                    marginRight: 'auto'
                                                }}>Fill schedule
                                        </button>
                                    </div>}
                                </form>
                            </div>
                        </div>

                    </Dialog>)}

                    {this.state.showUserScheduleModal && (<Dialog
                        open={this.state.showUserScheduleModal}
                        fullWidth
                        PaperProps={{
                            style: {
                                maxWidth: this.getModalWidthDays(),
                                maxHeight: '400px',
                                overflowY: 'hidden'
                            },
                        }}
                    >
                        <AppBar position="static">
                            <Toolbar className={classes.centerItems}>
                                <Typography variant="h6" className={classes.title}
                                            style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                                    Fill schedule
                                </Typography>

                                <IconButton aria-label="close" className={classes.closeButton}
                                            onClick={this.toggleUserSchedule}>
                                    <i className="fa fa-times" title="Key"></i>
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <div className={classes.modalContent}>
                            <div className="form-check">
                                <form className="fillShiftSchedule">
                                    <div>

                                        <table className="table table-bordered">
                                            <thead>
                                            <tr>
                                                <th style={{minWidth: '300px'}} scope="col">Shift</th>
                                                {this.getWeekDays().map(function(day) {
                                                    return <th style={{minWidth: '100px'}} scope="col" key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</th>
                                                })}
                                            </tr>
                                            </thead>
                                            <tbody>

                                            {/*1 Shift*/}
                                            <tr>
                                                <th style={{fontWeight: '500', fontSize: '15px'}} scope="row">
                                                    {this.state.default.firstShift.from.hour}:{this.state.default.firstShift.from.min}-{this.state.default.firstShift.to.hour}:{this.state.default.firstShift.to.min} ({this.israelTimeFormat(this.state.default.firstShift.from.hour, this.state.default.firstShift.from.min)}-{this.israelTimeFormat(this.state.default.firstShift.to.hour, this.state.default.firstShift.to.min)} Israel)
                                                </th>
                                                    {this.getWeekDays().map(function (day) {
                                                    return <td>
                                                        <div style={{width: '25px', height: '25px', flaot: 'left'}} key={day}>
                                                            <button type="button" className="btn btn-default btn-circle"
                                                                    onClick={() => this.toggleColorPicker('firstShift', day)}
                                                                    style={{
                                                                        backgroundColor: this.state.default.firstShift[day].user.color,
                                                                        width: '0',
                                                                        height: '25px'
                                                                    }}></button>

                                                            {this.state.default.firstShift[day].isVisibleColorPicker &&
                                                            <CompactPicker
                                                                onChange={(e) => this.colorChangeHandler(e, this.state.default.firstShift[day].user.id)}
                                                                className={classes.compactPicker}/>}
                                                        </div>

                                                        <select style={{
                                                            width: '100px',
                                                            margin: '-30px 0 0 35px',
                                                            'padding': '0'
                                                        }}
                                                                className="form-control"
                                                                onChange={(e) => this.handleUserSelection('firstShift', day, e)}
                                                                value={this.state.default.firstShift[day].user.id}>
                                                            {this.state.users.map(function (user) {
                                                                return <option value={user.id} key={user.id}>{user.name}</option>
                                                            })}
                                                        </select>
                                                    </td>
                                                }, this)}
                                            </tr>

                                            {/*2 Shift*/}
                                            {this.state.isVisibleSecondShift && <tr>
                                                <th style={{fontWeight: '500', fontSize: '15px'}} scope="row">
                                                    {this.state.default.secondShift.from.hour}:{this.state.default.secondShift.from.min}-{this.state.default.secondShift.from.min}:{this.state.default.secondShift.to.min} ({this.israelTimeFormat(this.state.default.secondShift.from.hour, this.state.default.secondShift.from.min)}-{this.israelTimeFormat(this.state.default.secondShift.to.hour, this.state.default.secondShift.to.min)} Israel)
                                                </th>
                                                    {this.getWeekDays().map(function (day) {
                                                        return <td>
                                                            <div style={{width: '25px', height: '25px', flaot: 'left'}} key={day}>
                                                                <button type="button" className="btn btn-default btn-circle"
                                                                        onClick={() => this.toggleColorPicker('secondShift', day)}
                                                                        style={{ backgroundColor: this.state.default.secondShift[day].user.color,
                                                                            width: '0', height: '25px' }}></button>

                                                                {this.state.default.secondShift[day].isVisibleColorPicker &&
                                                                <CompactPicker
                                                                    onChange={(e) => this.colorChangeHandler(e, this.state.default.secondShift[day].user.id)}
                                                                    className={classes.compactPicker}/>}
                                                            </div>

                                                            <select style={{ width: '100px', margin: '-30px 0 0 35px', 'padding': '0' }}
                                                                    className="form-control"
                                                                    onChange={(e) => this.handleUserSelection('secondShift', day, e)}
                                                                    value={this.state.default.secondShift[day].user.id}>
                                                                {this.state.users.map(function (user) {
                                                                    return <option value={user.id} key={user.id}>{user.name}</option>
                                                                })}
                                                            </select>
                                                        </td>
                                                    }, this)}
                                                </tr>}

                                            {/*3 Shift*/}
                                            {this.state.isVisibleThirdShift && <tr>
                                                <th style={{fontWeight: '500', fontSize: '15px'}} scope="row">
                                                    {this.state.default.thirdShift.from.hour}:{this.state.default.thirdShift.from.min}-{this.state.default.thirdShift.from.min}:{this.state.default.thirdShift.to.min} ({this.israelTimeFormat(this.state.default.thirdShift.from.hour, this.state.default.thirdShift.from.min)}-{this.israelTimeFormat(this.state.default.thirdShift.to.hour, this.state.default.thirdShift.to.min)} Israel)
                                                </th>
                                                {this.getWeekDays().map(function (day) {
                                                    return <td>
                                                        <div style={{width: '25px', height: '25px', flaot: 'left'}} key={day}>
                                                            <button type="button" className="btn btn-default btn-circle"
                                                                    onClick={() => this.toggleColorPicker('thirdShift', day)}
                                                                    style={{ backgroundColor: this.state.default.thirdShift[day].user.color,
                                                                        width: '0', height: '25px' }}></button>

                                                            {this.state.default.thirdShift[day].isVisibleColorPicker &&
                                                            <CompactPicker
                                                                onChange={(e) => this.colorChangeHandler(e, this.state.default.thirdShift[day].user.id)}
                                                                className={classes.compactPicker}/>}
                                                        </div>

                                                        <select style={{ width: '100px', margin: '-30px 0 0 35px', 'padding': '0' }}
                                                                className="form-control"
                                                                onChange={(e) => this.handleUserSelection('thirdShift', day, e,)}
                                                                value={this.state.default.thirdShift[day].user.id}>
                                                            {this.state.users.map(function (user) {
                                                                return <option value={user.id} key={user.id}>{user.name}</option>
                                                            })}
                                                        </select>
                                                    </td>
                                                }, this)}
                                            </tr>}
                                            </tbody>
                                        </table>
                                        <button type="button" onClick={this.submitSaveSchedule}
                                                className="btn btn-success" style={{marginLeft : this.getFillSaveButtonWidthMargin(), position: 'static'}}>Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </Dialog>)}
                </div>

            </div>
        )
    }
}

export default withStyles(styles)(ShiftManager)