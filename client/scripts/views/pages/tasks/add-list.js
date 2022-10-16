import Component from '../../../views/component';

import Tasks from '../../../models/tasks';

class AddAndList extends Component {
	static async getData() {
        return await Tasks.getTasksList();
    }

    static async render(tasks, userTasks, doneTasks, noStatusTasks, notStartedTasks, inProgressTask) {
        const user = JSON.parse(sessionStorage.user);
        userTasks = tasks.filter(task => task.userid === user.id);

        noStatusTasks = userTasks.filter(task => task.status === 'No status');
        notStartedTasks = userTasks.filter(task => task.status === 'Not started');
        inProgressTask = userTasks.filter(task => task.status === 'In progress');
        doneTasks = userTasks.filter(task => task.status === 'Done');

        return `
            <div class="modal_add">
                  <button class="modal_add_closebtn remove_btn">&#9587</button>
                  <div class="modal_header">
                        New Task                      
                  </div>
                  <div class="task-add">
                        <input class="task-add__title" type="text" placeholder="Task title">
                        <textarea class="task-add__description" placeholder="Task description"></textarea>             
                        <button class="task-add__btn-add button" disabled>Add Task</button>
                  </div>
            </div>
            
            <div class="modal_delete">
                  <button class="modal_delete_closebtn remove_btn">&#9587</button>
                  <div class="modal_header">
                        Are you sure?     
                  </div>
                  <button class="confirm">Yes</button>
                  <button class="decline">No</button>
            </div>
            
            <h1 class="page-title">My tasks</h1>
        
            <div class="task-add">
                <button class="task-add__btn wave_btn" >
                    <span class="wave_btn_text">Add task</span>
                    <span class="wave_btn_waves"></span>
                </button>
            </div>
     
            <div class="tasks">
                <div class="tasks__additional">
                    <button class="tasks__btn-clear button" ${!tasks.length ? 'disabled' : ''}>
                        Clear Tasks List
                    </button>
                </div>
                
                <div class="tasks__list">
                    ${noStatusTasks.map(task => this.getTaskHTML(task)).join('')} 
                </div>
            </div>
            
            <div class="table">
                
                <div class="table_status">
                    <h2>Not started
                        <span class="header_not-started"></span>
                    </h2>
                    <div class="table_column" data-status="notStarted">
                        ${notStartedTasks.map(task => this.getTaskHTML(task)).join('')}
                    </div>
                </div>
                
                <div class="table_status">
                    <h2 >In progress
                        <span class="header_in-progress"></span>
                    </h2>
                    <div class="table_column" data-status="inProgress">   
                        ${inProgressTask.map(task => this.getTaskHTML(task)).join('')}
                    </div>
                </div>
                
                <div class="table_status">
                    <h2 >Completed
                        <span class="header_done"></span>
                    </h2>
                    <div class="table_column" data-status="Done">                   
                        ${doneTasks.map(task => this.getTaskHTML(task)).join('')}
                    </div>
                </div>
                
            </div>
            
            <div class="overlay"></div>
        `;
    }

    static afterRender() {
        this.setActions();

		this.countTasksAmount();
    }

    static setActions() {
        const taskTitleField = document.getElementsByClassName('task-add__title')[0],
            taskDescriptionField = document.getElementsByClassName('task-add__description')[0],
            addTaskBtmModal = document.getElementsByClassName('task-add__btn')[0],
            modalAddList = document.getElementsByClassName('modal_add')[0],
            modalDelList = document.getElementsByClassName('modal_delete')[0],
            overlay = document.getElementsByClassName('overlay')[0],
            modalAddCloseBtn = document.getElementsByClassName('modal_add_closebtn')[0],
            modalDeleteCloseBtn = document.getElementsByClassName('modal_delete_closebtn')[0],
			addTaskBtn = document.getElementsByClassName('task-add__btn-add')[0],
			tasksContainer = document.getElementsByClassName('content-container')[0],
			clearTasksListBtn = document.getElementsByClassName('tasks__btn-clear')[0],
			tasksList = document.getElementsByClassName('tasks__list')[0],
            tableStatus = document.querySelectorAll('.table_status');

        taskTitleField.onkeyup = () => addTaskBtn.disabled = !taskTitleField.value.trim();
        addTaskBtn.onclick = () => this.addTask(taskTitleField, taskDescriptionField, addTaskBtn,
                                                clearTasksListBtn, tasksList, modalAddList, overlay);

        addTaskBtmModal.onclick = () => {
            taskTitleField.value = '';
            taskDescriptionField.value = '';
            modalAddList.classList.add('active');
            overlay.classList.add('overlay_active');
        };

        modalAddCloseBtn.onclick = () => {
            modalAddList.classList.remove('active');
            overlay.classList.remove('overlay_active');
        };

        modalDeleteCloseBtn.onclick = () => {
            modalDelList.classList.remove('active');
            overlay.classList.remove('overlay_active');
        };

        window.onclick = evt => {
            if (evt.target === overlay) {
                modalAddList.classList.remove('active');
                modalDelList.classList.remove('active');
                overlay.classList.remove('overlay_active');
            }
        };

		tasksContainer.onclick = evt => {
            const target = evt.target,
                targetClassList = target.classList;

            switch (true) {
                case targetClassList.contains('tasks__btn-clear'):
                    this.clearTasksList(tasksList, clearTasksListBtn, modalDelList, overlay);
                    break;

                case targetClassList.contains('task'):
                case targetClassList.contains('task__title'):
                    this.redirectToTaskInfo(target.dataset.id);
                    break;

                case targetClassList.contains('task__btn-remove'):
                    this.removeTask(tasksList, target.parentNode.parentNode, clearTasksListBtn, modalDelList, overlay);
                    break;
            }
        };

        !tasksList.children.length && !tableStatus[0].children.length && !tableStatus[1].children.length &&
        !tableStatus[2].children.length && (clearTasksListBtn.disabled = true);

        this.dragTask();
    }

    static async addTask(taskTitleField, taskDescriptionField, addTaskBtn, clearTasksListBtn, tasksList,
                         modalAddList, overlay) {
        const user = JSON.parse(sessionStorage.user);

        let newTask = {
            title: taskTitleField.value.trim(),
            description: taskDescriptionField.value.trim(),
            status: 'No status',
            userid: user.id
        };

        newTask = await Tasks.addTask(newTask);

        clearTasksListBtn.disabled && (clearTasksListBtn.disabled = false);

        tasksList.insertAdjacentHTML('beforeEnd', this.getTaskHTML(newTask));

        modalAddList.classList.remove('active');
        overlay.classList.remove('overlay_active');

        this.dragTask();

        this.countTasksAmount();
    }

    static getTaskHTML(task) {
        const statusDone = task.status === 'Done',
            statusNotStarted = task.status === 'Not started',
            statusInProgress = task.status === 'In progress';

        return `
            <div class="task ${statusDone ? 'done' : ''} ${statusNotStarted ? 'not_started' : ''} ${statusInProgress ? 'in_progress' : ''}" draggable="true" data-userid="${task.userid}" data-id="${task.id}">
                <a class="task__title" data-id="${task.id}">${task.title}</a>
                
                <div class="task__buttons">
                	${!statusDone ?
                `<a class="task__btn-edit svg-button" href="#/task/${task.id}/edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                        <rect width="20" height="20" rx="5" fill="#272732"/>
                        <path class="svg-fill" d="M6.52324 13.2812C6.55059 13.2812 6.57793 13.2785 6.60527 13.2744L8.90488 12.8711C8.93223 12.8656 8.9582 12.8533 8.97734 12.8328L14.7729 7.0373C14.7855 7.02466 14.7956 7.00963 14.8024 6.99309C14.8093 6.97655 14.8128 6.95882 14.8128 6.94092C14.8128 6.92301 14.8093 6.90528 14.8024 6.88874C14.7956 6.8722 14.7855 6.85718 14.7729 6.84453L12.5006 4.5709C12.4746 4.54492 12.4404 4.53125 12.4035 4.53125C12.3666 4.53125 12.3324 4.54492 12.3064 4.5709L6.51094 10.3664C6.49043 10.3869 6.47812 10.4115 6.47266 10.4389L6.06934 12.7385C6.05604 12.8117 6.06079 12.8871 6.08318 12.9581C6.10557 13.0291 6.14493 13.0935 6.19785 13.1459C6.28809 13.2334 6.40156 13.2812 6.52324 13.2812ZM7.44473 10.8969L12.4035 5.93945L13.4057 6.9416L8.44687 11.899L7.23145 12.1137L7.44473 10.8969ZM15.0312 14.4297H4.96875C4.72676 14.4297 4.53125 14.6252 4.53125 14.8672V15.3594C4.53125 15.4195 4.58047 15.4688 4.64062 15.4688H15.3594C15.4195 15.4688 15.4688 15.4195 15.4688 15.3594V14.8672C15.4688 14.6252 15.2732 14.4297 15.0312 14.4297Z" fill="#6F6F73"/>
                    </svg>
                 </a>`
					: ''}
                    <button class="task__btn-remove remove_btn">
                        &#9587
                    </button>   
                </div>                            
            </div>
        `;
    }

    static dragTask() {
        const dragTasks = document.querySelectorAll('.task'),
            tableStatus = document.querySelectorAll('.table_status');

        let draggableTask = null;

        dragTasks.forEach((task) => {
            task.addEventListener('dragstart', dragStart);
            task.addEventListener('dragend', dragEnd);
        });

        tableStatus.forEach((status) => {
            status.addEventListener('dragover', dragOver);
            status.addEventListener('dragenter', dragEnter);
            status.addEventListener('dragleave', dragLeave);
            status.addEventListener('drop', dragDrop);
        });

        function dragStart() {
            draggableTask = this;
        }

        function dragEnd() {
            draggableTask = null;
        }

        function dragOver(evt) {
            evt.preventDefault();
        }
        function dragEnter() {
            this.style.boxShadow = '0 0 20px rgba(73, 115, 255, 1)';
        }
        function dragLeave() {
            this.style.boxShadow = 'none';
        }

        async function dragDrop(evt) {
            const target = evt.target;

            this.style.boxShadow = 'none';

            if (draggableTask !== null) {
                this.children[1].appendChild(draggableTask);

                let newTaskStatus = {};

                switch (true) {
                    case target.dataset.status === 'notStarted':
                         newTaskStatus = {
                            id: draggableTask.dataset.id,
                            status: 'Not started'
                        };
                        if (draggableTask.children[1].children.length === 1) {
                            draggableTask.children[1].insertAdjacentHTML('afterbegin',
                                `<a class="task__btn-edit" href="#/task/${draggableTask.dataset.id}/edit">
                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                                            <rect width="20" height="20" rx="5" fill="#272732"/>
                                            <path class="svg-fill" d="M6.52324 13.2812C6.55059 13.2812 6.57793 13.2785 6.60527 13.2744L8.90488 12.8711C8.93223 12.8656 8.9582 12.8533 8.97734 12.8328L14.7729 7.0373C14.7855 7.02466 14.7956 7.00963 14.8024 6.99309C14.8093 6.97655 14.8128 6.95882 14.8128 6.94092C14.8128 6.92301 14.8093 6.90528 14.8024 6.88874C14.7956 6.8722 14.7855 6.85718 14.7729 6.84453L12.5006 4.5709C12.4746 4.54492 12.4404 4.53125 12.4035 4.53125C12.3666 4.53125 12.3324 4.54492 12.3064 4.5709L6.51094 10.3664C6.49043 10.3869 6.47812 10.4115 6.47266 10.4389L6.06934 12.7385C6.05604 12.8117 6.06079 12.8871 6.08318 12.9581C6.10557 13.0291 6.14493 13.0935 6.19785 13.1459C6.28809 13.2334 6.40156 13.2812 6.52324 13.2812ZM7.44473 10.8969L12.4035 5.93945L13.4057 6.9416L8.44687 11.899L7.23145 12.1137L7.44473 10.8969ZM15.0312 14.4297H4.96875C4.72676 14.4297 4.53125 14.6252 4.53125 14.8672V15.3594C4.53125 15.4195 4.58047 15.4688 4.64062 15.4688H15.3594C15.4195 15.4688 15.4688 15.4195 15.4688 15.3594V14.8672C15.4688 14.6252 15.2732 14.4297 15.0312 14.4297Z" fill="#6F6F73"/>
                                        </svg>
                                      </a>`);
                        }

                        draggableTask.classList.remove('done');
                        draggableTask.classList.remove('in_progress');
                        draggableTask.classList.add('not_started');

                        await Tasks.editTaskStatus(newTaskStatus);

                        countTasksAmount();
                        break;

                    case target.dataset.status === 'inProgress':
                         newTaskStatus = {
                            id: draggableTask.dataset.id,
                            status: 'In progress'
                        };

                        if (draggableTask.children[1].children.length === 1) {
                            draggableTask.children[1].insertAdjacentHTML('afterbegin',
                                `<a class="task__btn-edit" href="#/task/${draggableTask.dataset.id}/edit">
                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                                            <rect width="20" height="20" rx="5" fill="#272732"/>
                                            <path class="svg-fill" d="M6.52324 13.2812C6.55059 13.2812 6.57793 13.2785 6.60527 13.2744L8.90488 12.8711C8.93223 12.8656 8.9582 12.8533 8.97734 12.8328L14.7729 7.0373C14.7855 7.02466 14.7956 7.00963 14.8024 6.99309C14.8093 6.97655 14.8128 6.95882 14.8128 6.94092C14.8128 6.92301 14.8093 6.90528 14.8024 6.88874C14.7956 6.8722 14.7855 6.85718 14.7729 6.84453L12.5006 4.5709C12.4746 4.54492 12.4404 4.53125 12.4035 4.53125C12.3666 4.53125 12.3324 4.54492 12.3064 4.5709L6.51094 10.3664C6.49043 10.3869 6.47812 10.4115 6.47266 10.4389L6.06934 12.7385C6.05604 12.8117 6.06079 12.8871 6.08318 12.9581C6.10557 13.0291 6.14493 13.0935 6.19785 13.1459C6.28809 13.2334 6.40156 13.2812 6.52324 13.2812ZM7.44473 10.8969L12.4035 5.93945L13.4057 6.9416L8.44687 11.899L7.23145 12.1137L7.44473 10.8969ZM15.0312 14.4297H4.96875C4.72676 14.4297 4.53125 14.6252 4.53125 14.8672V15.3594C4.53125 15.4195 4.58047 15.4688 4.64062 15.4688H15.3594C15.4195 15.4688 15.4688 15.4195 15.4688 15.3594V14.8672C15.4688 14.6252 15.2732 14.4297 15.0312 14.4297Z" fill="#6F6F73"/>
                                        </svg>
                                      </a>`);
                        }

                        draggableTask.classList.remove('done');
                        draggableTask.classList.remove('not_started');
                        draggableTask.classList.add('in_progress');

                        await Tasks.editTaskStatus(newTaskStatus);

                        countTasksAmount();
                        break;

                    case target.dataset.status === 'Done':
                        newTaskStatus = {
                            id: draggableTask.dataset.id,
                            status: 'Done'
                        };

                        if (draggableTask.children[1].children.length === 2) {
                            draggableTask.children[1].children[0].remove();
                        }

                        draggableTask.classList.remove('not_started');
                        draggableTask.classList.remove('in_progress');
                        draggableTask.classList.add('done');

                        await Tasks.editTaskStatus(newTaskStatus);

                        countTasksAmount();
                        break;
                }
            }

            function countTasksAmount() {
                const notStartedCounter = document.getElementsByClassName('header_not-started')[0],
                    inProgressCounter = document.getElementsByClassName('header_in-progress')[0],
                    doneCounter = document.getElementsByClassName('header_done')[0],
                    notStartedAmount = document.getElementsByClassName('not_started').length,
                    inProgressAmount = document.getElementsByClassName('in_progress').length,
                    doneAmount = document.getElementsByClassName('done').length;

                notStartedCounter.innerHTML = String(notStartedAmount);
                inProgressCounter.innerHTML = String(inProgressAmount);
                doneCounter.innerHTML = String(doneAmount);
            }
        }
    }

    static countTasksAmount() {
        const notStartedCounter = document.getElementsByClassName('header_not-started')[0],
            inProgressCounter = document.getElementsByClassName('header_in-progress')[0],
            doneCounter = document.getElementsByClassName('header_done')[0],
            notStartedAmount = document.getElementsByClassName('not_started').length,
            inProgressAmount = document.getElementsByClassName('in_progress').length,
            doneAmount = document.getElementsByClassName('done').length;

        notStartedCounter.innerHTML = String(notStartedAmount);
        inProgressCounter.innerHTML = String(inProgressAmount);
        doneCounter.innerHTML = String(doneAmount);
    }

    static clearTasksList(tasksList, clearTasksListBtn, modalDelList, overlay) {
        const tableStatus = document.querySelectorAll('.table_column'),
            confirmBtn = document.getElementsByClassName('confirm')[0],
            declineBtn = document.getElementsByClassName('decline')[0];

        modalDelList.classList.add('active');
        overlay.classList.add('overlay_active');

        declineBtn.onclick = () => hideModal();

        function hideModal() {
            modalDelList.classList.remove('active');
            overlay.classList.remove('overlay_active');
        }

        confirmBtn.onclick = async() => {
            clearTasksListBtn.disabled = true;
            tasksList.innerHTML = '';
            tableStatus.forEach(status => status.innerHTML = '');

            await Tasks.clearTasksList();

            hideModal();
            this.countTasksAmount();
        };
	}

    static redirectToTaskInfo(id) {
        location.hash = `#/task/${id}`;
    }

    static  removeTask(tasksList, taskContainer, clearTasksListBtn, modalDelList, overlay) {
        const tableStatus = document.getElementsByClassName('table_status'),
            confirmBtn = document.getElementsByClassName('confirm')[0],
            declineBtn = document.getElementsByClassName('decline')[0];

        modalDelList.classList.add('active');
        overlay.classList.add('overlay_active');

        declineBtn.onclick = () => hideModal();

        function hideModal() {
            modalDelList.classList.remove('active');
            overlay.classList.remove('overlay_active');
        }

        confirmBtn.onclick = async() => {
            taskContainer.remove();
            !tasksList.children.length && !tableStatus[0].children.length && !tableStatus[1].children.length &&
            !tableStatus[2].children.length && (clearTasksListBtn.disabled = true);

            await Tasks.removeTask(taskContainer.dataset.id);

            hideModal();
            this.countTasksAmount();
        };
    }
}
export default AddAndList;