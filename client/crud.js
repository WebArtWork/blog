/*
* Crud file for client side pgen
*/
crudServices.Pgen = function($http, $timeout, socket){
	// Initialize
		var srv = {};
	// Routes
		srv.create = function(obj, callback){
			$http.post('/api/pgen/create', obj||{})
			.then(function(resp){
				if(resp.data&&typeof callback == 'function'){
					callback(resp.data);
				}else if(typeof callback == 'function'){
					callback(false);
				}
			});
		}
		srv.update = function(obj, callback){
			if(!obj) return;
			$timeout.cancel(obj.updateTimeout);
			if(!obj.name) obj.name='';
			if(socket) obj.print = socket.id;
			$http.post('/api/pgen/update'+obj.name, obj)
			.then(function(resp){
				if(resp.data&&typeof callback == 'function'){
					callback(resp.data);
				}else if(typeof callback == 'function'){
					callback(false);
				}
			});		
		}
		srv.updateAfterWhile = function(obj, callback){
			$timeout.cancel(obj.updateTimeout);
			obj.updateTimeout = $timeout(function(){
				srv.update(obj, callback);
			}, 1000);
		}
		srv.delete = function(obj, callback){
			if(!obj) return;
			if(socket) obj.print = socket.id;
			$http.post('/api/pgen/delete', obj)
			.then(function(resp){
				if(resp.data&&typeof callback == 'function'){
					callback(resp.data);
				}else if(typeof callback == 'function'){
					callback(false);
				}
			});
		}
	// Sockets
		socket.on('PgenUpdate', function(pgen){
			if(!pgen.print||pgen.print==socket.id) return;
			if(typeof srv.PgenUpdate == 'function'){
				srv.PgenUpdate(pgen);
			}
		});
		socket.on('PgenDelete', function(pgen){
			if(!pgen.print||pgen.print==socket.id) return;
			if(typeof srv.PgenDelete == 'function'){
				srv.PgenDelete(pgen);
			}
		});
	// End of service
	return srv;
}