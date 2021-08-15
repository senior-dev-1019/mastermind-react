import React, {Component} from 'react'
import {withStyles} from '@material-ui/styles'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import styles from './UserState-jss';
import NoSleep from 'nosleep.js';
import {AppBar, Button, Dialog, IconButton, Toolbar, Typography} from "@material-ui/core";
import {request} from "../../utils/request";
import Swal from 'sweetalert2';
import {ALL_USERS_URL, SAVE_REPORT} from "../../redux/actions/adminRoutes";
import 'rc-time-picker/assets/index.css';
import ReactDom from 'react-dom';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

class UserState extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShiftReportModalOpen: false,
            isShiftReportConfirmModalOpen: false,
            isEndOfShiftReportModalOpen: false,
            numberOfCalls: null,
            report: {},
            hotels: {}
        };
        this.toggleShiftReportModal = this.toggleShiftReportModal.bind(this);
        this.toggleShiftConfirmReportModal = this.toggleShiftConfirmReportModal.bind(this);
        this.toggleEndOfShiftModal = this.toggleEndOfShiftModal.bind(this);
        this.setNumberOfCalls = this.setNumberOfCalls.bind(this);
        this.getNumberOfCalls = this.getNumberOfCalls.bind(this);
    }

    componentWillMount() {

    }

    getNumberOfCalls(definedNumberOfCalls = null) {
        // get all hotel type hotels
        if(Object.entries(this.state.hotels).length === 0) {
            this.getAllHotelTypeUsers();
        }

        // get number of calls
        if(definedNumberOfCalls) {
            return Array.from({length: definedNumberOfCalls}, (v, k) => k+1)
        }
        return Array.from({length: this.state.numberOfCalls}, (v, k) => k+1)
    }

    setNumberOfCalls(value) {
        this.setState({ numberOfCalls: value });
        this.setState({ state: this.state });

        // set report default data
        let defaultReportData = [];
        Array.from({length: value}, (v, k) => k+1).forEach(function(callNumber) {
            defaultReportData[callNumber] = {
                type : null,
                time : '10:00',
                hotel : null,
                room : null,
                is_tech_issue : null,
                message : null
            };
        });
        this.setState({report : defaultReportData})
    }

    getAllHotelTypeUsers() {
        request(ALL_USERS_URL, {})
            .then(response => {
                // filter users
                let filteredHotels = [];
                response.data.users.forEach(function (user) {
                    if (user.role === 0) {
                        filteredHotels.push(user)
                    }
                });

                // set hotels
                this.setState({hotels: filteredHotels});
            })
    }

    toggleShiftReportModal() {
        this.setState(state => ({isShiftReportModalOpen: !state.isShiftReportModalOpen}));
        this.setState({isShiftReportConfirmModalOpen: false});
    }

    toggleShiftConfirmReportModal() {
        this.setState({isShiftReportModalOpen: false});
        this.setState(state => ({isShiftReportConfirmModalOpen: !state.isShiftReportConfirmModalOpen}));
    }

    toggleEndOfShiftModal() {
        this.setNumberOfCalls(0);
        this.setState({isShiftReportModalOpen: false});
        this.setState({isShiftReportConfirmModalOpen: false});
        this.setState(state => ({isEndOfShiftReportModalOpen: !state.isEndOfShiftReportModalOpen}));
    }

    handleFormChanges(value, callNumber, field) {
        console.log(field);
        if(field === 'time') {
            console.log(value);
            value = moment(value, 'HH:mm').utcOffset('-04:00').format('HH:mm')
        }
        console.log(value);
        this.setState(prevState => ({
            report: {
                ...prevState.report,
                [callNumber]: {
                    ...prevState.report[callNumber],
                    [field]: field === 'is_tech_issue' ? !this.state.report[callNumber][field] : value
                }
            }
        }));
    }

    submitShiftReport() {
        this.setState(state => ({isEndOfShiftReportModalOpen: false}));
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to save this shift report?`,
            icon: 'warning',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save it!'
        }).then((result) => {
            if (result.value) {
                request(SAVE_REPORT, {report: this.state.report})
                    .then(response => {
                        this.toggleEndOfShiftModal();
                        this.setState(state => ({isEndOfShiftReportModalOpen: false}));
                        if(response.data.status) {
                            Swal.fire('Success!', 'Your report was successfully saved', 'success');
                        }
                        else {
                            Swal.fire('Error!', 'An error occurred trying to save the report. PLease try again later.', 'error');
                        }
                    })
            }
            else {
                this.setState(state => ({isEndOfShiftReportModalOpen: true}));
            }
        });
    }

    handleChange(value) {
        const {setOnline} = this.props;
        if (value === 0) {
            this.setState(state => ({isShiftReportModalOpen: !state.isShiftReportModalOpen}));
        }
        setOnline(value);
        this.handleNoSleep(value);
    }

    handleNoSleep(working) {
        try {
            let noSleep = new NoSleep();
            if (working) {
                noSleep.enable();
            } else {
                noSleep.disable();
            }
        } catch (e) {
            console.log('No sleep is not supported', e);
        }
    }

    render() {
        const {classes, online} = this.props;
        return (
            <section>
                <div className={classes.userStateWidget}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-simple">
                            You are now
                        </InputLabel>
                        <Select
                            value={online}
                            onChange={(e) => this.handleChange(e.target.value)}
                            labelWidth={100}
                            inputProps={{
                                name: 'userState',
                                id: 'user-state',
                            }}
                            classes={{root: online == 1 ? classes.greenColor : classes.redColor}}
                        >
                            <MenuItem style={{color: 'green'}} value={1}>Online</MenuItem>
                            <MenuItem style={{color: 'red'}} value={0}>Offline</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {this.state.isShiftReportModalOpen && (<Dialog
                    fullWidth
                    open={this.state.isShiftReportModalOpen}>
                    <AppBar position="static">
                        <Toolbar className={classes.centerItems}>
                            <Typography variant="h6" className={classes.title}
                                        style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                                Submit end of shift report?
                            </Typography>
                            <IconButton aria-label="close" className={classes.closeButton}
                                        onClick={this.toggleShiftReportModal}>
                                <i className="fa fa-times" title="Key"></i>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.modalContent}>
                        <div className="form-check">
                            <div style={{margin: '60px'}}>
                                <button onClick={this.toggleEndOfShiftModal} type="submit" className="btn btn-success"
                                        style={{
                                            textAlign: 'center',
                                            marginRight: 'auto',
                                            width: '100px',
                                            marginLeft: '10%',
                                            fontSize: '20px'
                                        }}>Yes
                                </button>

                                <button onClick={this.toggleShiftConfirmReportModal} type="submit" className="btn btn-default"
                                        style={{
                                            textAlign: 'center',
                                            marginRight: 'auto',
                                            width: '100px',
                                            marginLeft: '30%',
                                            fontSize: '20px',
                                            backgroundColor: '#ddd'
                                        }}>No
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>)}

                {this.state.isShiftReportConfirmModalOpen && (<Dialog
                    fullWidth
                    open={this.state.isShiftReportConfirmModalOpen}>
                    <AppBar position="static">
                        <Toolbar className={classes.centerItems}>
                            <Typography variant="h6" className={classes.title}
                                        style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                                Are you sure?
                            </Typography>
                            <IconButton aria-label="close" className={classes.closeButton}
                                        onClick={this.toggleShiftConfirmReportModal}>
                                <i className="fa fa-times" title="Key"></i>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.modalContent}>
                        <div className="form-check">
                            <div style={{margin: '60px'}}>
                                <button onClick={this.toggleShiftConfirmReportModal} type="submit"
                                        className="btn btn-success"
                                        style={{
                                            textAlign: 'center',
                                            marginRight: 'auto',
                                            width: '100px',
                                            marginLeft: '10%',
                                            fontSize: '20px'
                                        }}>Yes
                                </button>

                                <button onClick={this.toggleShiftReportModal} type="submit" className="btn btn-default"
                                        style={{
                                            textAlign: 'center',
                                            marginRight: 'auto',
                                            width: '100px',
                                            marginLeft: '30%',
                                            fontSize: '20px',
                                            backgroundColor: '#ddd'
                                        }}>No
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>)}

                {this.state.isEndOfShiftReportModalOpen && (<Dialog
                    fullWidth
                    open={this.state.isEndOfShiftReportModalOpen}
                    PaperProps={{
                        style: {
                            maxWidth: '800px'
                        },
                    }}>
                    <AppBar position="static">
                        <Toolbar className={classes.centerItems}>
                            <Typography variant="h6" className={classes.title}
                                        style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                                End of shift report
                            </Typography>
                            <IconButton aria-label="close" className={classes.closeButton}
                                        onClick={this.toggleEndOfShiftModal}>
                                <i className="fa fa-times" title="Key"></i>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.modalContent}>
                        <div className="form-check" style={{margin: '20px 30px 20px 10px'}}>
                            <div className="form-group">
                                <select className="form-control" onChange={(e) => this.setNumberOfCalls(e.target.value)} style={{width: '100%'}}>
                                    <option disabled selected>Number of calls</option>
                                    {this.getNumberOfCalls(99).map(function (call) {
                                        return <option value={call} key={call}>{call}</option>
                                    })}
                                </select>

                                {/*Form Calls*/}
                                {this.state.numberOfCalls > 0 &&  this.getNumberOfCalls().map(function(callNumber) {
                                    return <section>
                                        <span style={{ position: 'absolute', margin: '20px 0 0 7px'}} key={callNumber}>{callNumber}.</span>
                                        <form style={{border: '1px solid #ddd', padding: '20px', marginTop: '15px'}}>
                                            <div className="form-row" style={{marginLeft: '0'}}>
                                                <div className="form-group col-md-2">
                                                        <select className="form-control" 
                                                            onChange={(e) => this.handleFormChanges(e.target.value, callNumber, 'type')}>
                                                            <option disabled selected>Call type</option>
                                                            {['general', 'check-in'].map(function (callType) {
                                                                return <option value={callType} key={callType}>{callType.charAt(0).toUpperCase() + callType.slice(1)}</option>
                                                            })}
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <TimePicker defaultValue={moment(this.state.report[callNumber].time, 'HH:mm')}
                                                                style={{width: '105px'}}
                                                                className="form-control"
                                                                onChange={(time) => this.handleFormChanges(time.format('HH:mm'), callNumber, 'time')}
                                                                showSecond={false} />

                                                </div>
                                                <div className="form-group col-md-2">
                                                    <select className="form-control"
                                                            onChange={(e) => this.handleFormChanges(e.target.value, callNumber, 'hotel')}>
                                                        <option disabled selected>Hotel</option>
                                                        {this.state.hotels.map(function (hotel) {
                                                            return <option value={hotel.id} key={hotel.id}>{hotel.name}</option>
                                                        })}
                                                    </select>
                                                </div>
                                                {this.state.report[callNumber].type === 'check-in' && <div className="form-group col-md-2">
                                                    <input type="text" placeholder="Room #" className="form-control"
                                                           onChange={(e) => this.handleFormChanges(e.target.value, callNumber, 'room')}/>
                                                </div>}
                                                <div className="form-group col-md-4">
                                                    <div style={{marginTop: '10px'}}>
                                                        <input checked={this.state.report[callNumber].is_tech_issue}
                                                               onClick={(e) => this.handleFormChanges(e.target.value || false, callNumber, 'is_tech_issue')}
                                                               type="checkbox" id={callNumber}/>
                                                        <label htmlFor={callNumber}>Technical issues</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-row" style={{marginLeft: '0'}}>
                                            <textarea className="form-control" rows="2" style={{marginLeft: '5px'}}
                                                      onChange={(e) => this.handleFormChanges(e.target.value, callNumber, 'message')}
                                                      placeholder="Write here any information about technical problems or special issues with the guest"></textarea>
                                            </div>
                                        </form>
                                    </section>
                                }, this)}

                                <button type="button" onClick={() => this.submitShiftReport()} style={{width: '100px', margin: '3% 0 0 40%'}}
                                        className="btn btn-success">Save</button>
                            </div>
                        </div>
                    </div>
                </Dialog>)}
            </section>
        );
    }
}

export default withStyles(styles)(UserState);