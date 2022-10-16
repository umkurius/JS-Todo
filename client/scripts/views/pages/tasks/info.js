import Component from '../../../views/component';

import Error404 from '../../../views/pages/error404';

import Tasks from '../../../models/tasks';

class Info extends Component {
	static async getData() {
		return await Tasks.getTask(this.urlParts.id);
	}

    static async render(task) {
		let html;

		if (!task.error) {
			const {id, title, description, status} = task;

			html = `
				<h1 class="page-title">Task Info</h1>
				
				<div class="task-info">
					<p>
						<b>Task Title:</b>
						${title}
					</p>
					<p>
						<b>Task Description:</b>
						${description}
					</p>
					<p>
						<b>Task Status:</b>
						${status}
					</p>
					
					<div class="task-info__buttons">
						${status !== 'Done' ?
							`<a class="task-info__btn-edit button" href="#/task/${id}/edit">Edit Task</a>`
						: ''}
						<a class="task-info__btn-back button" href="#/tasks">Back to List</a>
					</div>
				</div>
			`;
		} else {
			html = Error404.render();
		}

		return html;
    }
}

export default Info;