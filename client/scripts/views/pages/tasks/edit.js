import Component from '../../../views/component';

import Error404 from '../../../views/pages/error404';

import Tasks from '../../../models/tasks';

class Edit extends Component {
    static async getData() {
        this.task = await Tasks.getTask(this.urlParts.id);

        return this.task;
    }

    static async render(task) {
        let html;

        if (this.isEditEnable()) {
            const {id, title, description} = task;

            html = `
                <h1 class="page-title">Task Edit</h1>
                
                <div class="task-edit">
                    <p>
                        <b>Task Title:</b>
                        <input class="task-edit__title" type="text" value="${title}">
                    </p>
                    <p>
                        <b>Task Description:</b>
                        <textarea class="task-edit__description">${(description === 'No Description') ? '' : description}</textarea>
                    </p>
            
                    <div class="task-edit__buttons">
                        <button class="task-edit__btn-save button">Save Task</button>
                        <a class="task-edit__btn-back button" href="#/task/${id}">Back to Info</a>
                    </div>
                </div>
            `;
        } else {
            html = Error404.render();
        }

        return html;
    }

    static afterRender() {
       this.isEditEnable() && this.setActions();
    }

	static isEditEnable() {
		return !this.task.error &&
               this.task.status !== 'Done' &&
               !location.hash.split(this.urlParts.action)[1];
	}

    static setActions() {
        const taskTitleField = document.getElementsByClassName('task-edit__title')[0],
            taskDescriptionField = document.getElementsByClassName('task-edit__description')[0],
			saveTaskBtn = document.getElementsByClassName('task-edit__btn-save')[0];

        taskTitleField.onkeyup = () => saveTaskBtn.disabled = !taskTitleField.value.trim();
        saveTaskBtn.onclick = () => this.editTask(taskTitleField, taskDescriptionField);
    }

    static async editTask(taskTitleField, taskDescriptionField) {
        this.task.title = taskTitleField.value.trim();
        this.task.description = taskDescriptionField.value.trim();

		await Tasks.editTask(this.task);

        this.redirectToTaskInfo();
    }

    static redirectToTaskInfo() {
        location.hash = `#/task/${this.task.id}`;
    }
}

export default Edit;