
let colors = {
	lightBlue:'#61BEE1',
	blue:'#357DBB',
	yellow:'#EEAB66'
};
window.onload = function (argument) {
	
	let config = argument || COMPONENT;
	let className = '.radio';
	let groupKey = 'data-group';
	let radioColor = 'data-color';


	let radios = document.querySelectorAll(className); 
	radios.forEach((elem,index)=>{
		elem.onclick = (event) => {
			let target = event.currentTarget;
			let group = target.attributes[groupKey].nodeValue;
			let color = target.attributes[radioColor].nodeValue;
			if (group) {
				let radios = document.querySelectorAll(className); 
				radios.forEach((elem,index)=>{
					let groupName = elem.attributes[groupKey];
					if (groupName && groupName.nodeValue === group) {
						elem.classList.remove('active');
						let child = elem.querySelector('span');
						child.style.backgroundColor = '';
					}
				});
			}
			target.classList.add('active');
			let child = target.querySelector('span');
			child.style.backgroundColor = colors[color];
		}
	});
	radios = null;
}