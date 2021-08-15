import React from 'react';
export const getIconByRole = ($role) => {
    switch($role) {
		case 0: return 'fa-hotel';
		case 1: return 'fa-concierge-bell';
		case 2: return 'fa-user-tie';
		case 10: return 'fa-user-cog';
		default: return 'fa-question-circle';
	}
}

export const  getRoleById = ($id) => {
	switch($id) {
		case 0: return 'Hotel';
		case 1: return 'Reception';
		case 2: return 'Manager';
		case 10: return 'Administrator';
		default: return 'Unknown';
	}
}
export const statusBtn = (status) => {
    if(status === 1){
        return <button className="btn btn-xs btn-success btn-block">Online</button>;
    }else if(status === 0){
        return <button className="btn btn-xs btn-danger btn-block">Offline</button>;
    }else {
        return <button className="btn btn-xs btn-info btn-block">Background</button>;
    }
}

export const getStatusButton = ($status) => {
	switch($status){
		case 1: return <button className="btn btn-xs btn-block btn-success">Succeeded</button>;
		case 4: return <button className="btn btn-xs btn-block btn-success">Succeeded</button>;
		case 2: return <button className="btn btn-xs btn-block btn-danger">Missed</button>;
		case 3: return <button className="btn btn-xs btn-block btn-success">Succeeded</button>;
	}
}

export const getReportLink = ($report) => {
	if($report < 10) {
		return 'A00000' + $report
	}
	if($report < 100) {
		return 'A0000' + $report
	}
	if($report < 1000) {
		return 'A000' + $report
	}
	if($report < 10000) {
		return 'A00' + $report
	}
	if($report < 100000) {
		return 'A0' + $report
	}
	return 'A' + $report
}

export const videoResolutions = [
	'160x120',
	'240x180',
	'320x240',
	'640x360',
	'800x480',
	'960x720',
];