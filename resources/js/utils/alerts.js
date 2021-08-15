import Swal from 'sweetalert2';

const successDefaults = {
	title: 'Success!',
	text: '',
	type: 'success',
	toast:true,
	confirmButtonText: 'OK',
	position : 'top-right',
	timer : 4000
};

const errorDefaults = {
	title: 'Oups!',
	text: 'Error',
	type: 'error',
	toast: true,
	confirmButtonText: 'OK',
	position : 'top-right',
	timer : 10000
};

export const toast = ( message, type="info" ) => {
	Swal.fire({
		text: message,
		showConfirmButton: false,
		toast: true,
		type: type,
		position: 'bottom-end',
		timer: 10000
	});
}
export const error = ( message, options = {}, callback ) => {
	let opts = {...errorDefaults, ...options};
	opts.text = message;
	if(!callback){
		Swal.fire(opts);
	}else{
		Swal.fire(opts).then( () => {
				callback();
		});
	}
}
export const success = ( message, options = {}, callback ) => {
	let opts = {...successDefaults, ...options};
	opts.text = message;
	if(!callback){
		Swal.fire(opts);
	}else{
		Swal.fire(opts).then( () => {
				callback();
		});
	}
}
export const errors = ( errors, options, callback ) => {
	if(errors){
		for(let err in errors){
			error(errors[err], options, callback);
		}
	}
}

export const notificationPermissions = () => {
	try{
		Notification.requestPermission().then(function(result) {
			console.log(result);
		});
	}catch(e){
		console.log('Notification Permissions error', e)
	}
};

export const notify = (title, body) => {
	try {
		var options = {
			body: body,
			requireInteraction: true
		};
		var n = new Notification(title, options);
		// setTimeout(n.close.bind(n), 4000);
	}catch(e){
		console.log('notification error', e);
	}
}