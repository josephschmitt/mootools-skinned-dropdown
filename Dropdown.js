var Dropdown = new Class({
	Implements: Options,
	
	element: false,
	markup: false,
	clickCatcher: false,
	button: false,
	items: false,
	
	state: 'closed',
	
	options: {
		width: 100,
     	onSelect: function(val) {}
	},
	
	initialize: function(selectElement, options) {
		this.setOptions(options);
		
		this.element = $(selectElement);
		this.markup = this.createMarkup(this.element, this.options.width).inject(this.element.getParent());
		this.element.hide();
		
		this.button = this.markup.getElement('.dropdown');
		this.items = this.markup.getElement('.dropdown_items');
		this.items.hide();
		
		this.clickCatcher = new Element('div', {
			'class': 'clicker'
		}).inject($('container'));
		
		this.addEvents();
		this.closeDropdown();
	},
	
	createMarkup: function(selectEl, width) 
	{
		var name = $(selectEl).getProperty('id');

		var dropdown_wrapper = new Element('div', {
			'id': name+'_dropdown_wrapper',
			'class': 'dropdown_wrapper'
		});

		var dropdown = new Element('div', {
			'id': name+'_dropdown',
			'class': 'dropdown',
			'style': 'width:'+width+'px'
		}).inject(dropdown_wrapper);

		var dropdown_value = new Element('div', {
			'id': name+'_dropdown_value',
			'class': 'value',
			'html': $(selectEl).getProperty('value')
		}).inject(dropdown);

		var dropdown_items = new Element('div', {
			'id': name+'_dropdown_items',
			'class': 'dropdown_items',
			'style': 'width:'+(width+8)+'px'
		}).inject(dropdown_wrapper);

		var items_list = new Element('ul').inject(dropdown_items);

		var itemEl;
		$(selectEl).getChildren().each(function(option, index, items){
			itemEl = new Element('li', {
				'id': $(option).getProperty('id') + '_dropdown_item',
				'html': $(option).get('text')
			});
			itemEl.inject(items_list);
			if( option.getProperty('selected') ) itemEl.addClass('selected');
		});

		return dropdown_wrapper;
	},
	
	addEvents: function()
	{
		this.button.addEvent('click', this.onClick.bind(this));
		
		this.items.getElements('li').each(function(skinnedItem, index){
			skinnedItem.addEvent('click', function(e){
				this.onSelectItem( index, this.element.getElements('option')[index].getProperty('value') );
			}.bind(this));
		}.bind(this));
		
		this.element.onchange = function(){
			this.updateSkin();
		}.bind(this);
		
		this.clickCatcher.addEvent('click', this.closeDropdown.bind(this));
	},
	
	onSelectItem: function(index, value)
	{
		//Update unskinned item to be selected
		this.element.setProperty('value', value);
		this.element.onchange();
	},
	
	updateSkin: function()
	{
		var index = this.getSelectedIndex();
		var unskinnedItem = this.element.getElements('option')[index];
		var skinnedItem = this.items.getElements('li')[index];
		
		//unselected previously selected
		if( this.items.getElement('li.selected') )
			this.items.getElement('li.selected').removeClass('selected');
		
		//Update skinned item to have selected state
		skinnedItem.addClass('selected');
		
		//Update button text to be that of the selected item
		this.button.getElement('.value').setProperty('text', unskinnedItem.getProperty('text'));
		
		this.options.onSelect.run(this.getValue());
		this.closeDropdown();
	},
	
	getSelectedIndex: function()
	{
		var selected = 0;
		this.element.getElements('option').each(function(option, index){
			if( option.getProperty('selected') )
			{
				selected = index;
				return;
			}
		});
		return selected;
	},
	
	onClick: function()
	{
		if( this.state == 'closed') this.openDropdown();
		else this.closeDropdown();
	},
	
	openDropdown: function()
	{
		this.state = 'open';
		this.items.show();
		this.clickCatcher.show();
	},
	
	closeDropdown: function()
	{
		this.state = 'closed';
		this.items.hide();
		this.clickCatcher.hide();
	},
	
	getValue: function()
	{
		return this.element.getProperty('value');
	}
});

//Utility function to create the markup for the skinned dropdown from a select element
