frappe.pages['candidate-page'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Candidate',
		single_column: true
	});

	let $btn = page.set_primary_action(__("Add Candidate"), async function () {
		await create_new();
	});

	frappe.breadcrumbs.add("Setup");

	$(frappe.render_template("candidate_page")).appendTo(page.body.addClass("no-border"));

	const editButtons = document.getElementsByTagName("button")
	for (let b of editButtons) {
		b.addEventListener("click", async (e) => {await edit(e.target.id)})
	}
}

async function create_new() {
	// Create the Dialog
	let d = new frappe.ui.Dialog({
		title: "New Candidate",
		fields: await get_fields(),
		size: 'large', // small, large, extra-large 
		primary_action_label: 'Save',
		async primary_action(values) {
			values["doctype"] = "Candidate";
			await frappe.call({
				type: "POST",
				method: "frappe.client.save",
				args: {
					doc: values
				},
				callback: function (r) {
					console.log(r.message);
					//show_alert with indicator for success
					frappe.show_alert({
						message:__('Candidate Saved Successfully'),
						indicator:'green'
					}, 5);
				},
				error: (r) => {
					console.log(r);
					//show_alert with indicator for failure
					frappe.show_alert({
						message:__('Something went wrong'),
						indicator:'red'
					}, 5);
				}
			});
			d.hide();
		}
	});
	d.show();
}

async function get_fields() {
	var fields = [];
	await frappe.call({
		method: "techchallengeapp.api.get_fields",
		args: {"doctype": "Candidate"},
		callback: (r) => {
			fields = r.message;
		},
		error: (r) => {
			console.log(r);
		}
	});
	return fields;
}


async function get_fields_and_data(id) {
	var fields = await get_fields();
	await frappe.call({
        method: "frappe.client.get",
        type: "GET",
        args: { doctype: "Candidate", name: id, filters: null },
        callback: (r) => {
			fields["data"] = r.message;
		}
	});
	return fields;
}


async function edit(id) {
	let d = new frappe.ui.Dialog({
		title: id,
		fields: await get_fields_and_data(),
		size: 'large', // small, large, extra-large 
		primary_action_label: 'Save',
		async primary_action(values) {
			values["doctype"] = "Candidate";
			await frappe.call({
				type: "PUT",
				method: "frappe.client.save",
				args: {
					doc: values
				},
				callback: function (r) {
					console.log(r.message);
					//show_alert with indicator for success
					frappe.show_alert({
						message:__('Candidate Saved Successfully'),
						indicator:'green'
					}, 5);
				},
				error: (r) => {
					console.log(r);
					//show_alert with indicator for failure
					frappe.show_alert({
						message:__('Something went wrong'),
						indicator:'red'
					}, 5);
				}
			});
			d.hide();
		}
	});
	d.show();
}