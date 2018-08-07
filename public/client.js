//Triggers
// Get the Habits for that user
function populateHabitsByUsername(loggedinUser) {
    //Get AJAX User Entries call, render on page
    if ((loggedinUser == "") || (loggedinUser == undefined) || (loggedinUser == null)) {
        loggedinUser = $('#loggedin-user').val();
    }
    //console.log(loggedinUser);
    //make the api call to get habits by username
    $.ajax({
            type: 'GET',
            url: `/get-habit/${loggedinUser}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function (result) {
            console.log(result);
            displayHabits(result.habitsOutput);
            $('.habit-edit-screen').hide();
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

// To display habits on user dashboard
function displayHabits(result) {
    //create an empty variable to store each habits of a user
    let buildTheHtmlOutput = "";

    $.each(result, function (resultKey, resultValue) {

        buildTheHtmlOutput += '<div class="habit-container" id="habit-container-js">';
        buildTheHtmlOutput += '<div class="habit-name">';
        buildTheHtmlOutput += '<div class="habit-title">';
        buildTheHtmlOutput += '<h4>' + resultValue.habitName + '</h4>';
        buildTheHtmlOutput += '<p><i class="fas fa-trophy"></i>' + resultValue.checkin + ' Check-ins</p>';
        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '<div class="habit-edit-bar">';
        buildTheHtmlOutput += '<a onclick="deleteHabit(\'' + resultValue._id + '\',\'' + resultValue.loggedinUser + '\')"><i class="far fa-trash-alt" id="delete-habit-js"></i><span>Delete</span></a>';
        buildTheHtmlOutput += '<a onclick="editHabit(\'' + resultValue._id + '\')"><i class="fas fa-pencil-alt" id="edit-habit-js"></i><span>Edit</span></a>';
        buildTheHtmlOutput += '<a onclick="checkinHabit(\'' + resultValue._id + '\')"><i class="far fa-calendar-check"></i><span>Check-in</span></a>';
        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '<div class="note-milestone-container">';
        buildTheHtmlOutput += '<input type="hidden" class="noteMilestoneContainerID" value="' + resultValue._id + '">';

        //notes wrapper start
        buildTheHtmlOutput += '<div class="notes-container ' + resultValue._id + '">';
        // Get the notes content and display
        populateNotesByHabitId(resultValue._id);
        buildTheHtmlOutput += '</div>';
        //notes wrapper stop

        //milestone wrapper start
        buildTheHtmlOutput += '<div class="milestone-container ' + resultValue._id + '">';
        buildTheHtmlOutput += '</div>';
        //milestone wrapper stop

        // Get the milestone items and display here
        populateMilestoneItemsByHabitId(resultValue._id);

        buildTheHtmlOutput += '</div>';

        // Start habit edit form
        buildTheHtmlOutput += '<div class="habit-edit-screen" id="' + resultValue._id + '">';
        buildTheHtmlOutput += '<form role="form" class="habit-edit-form">';
        buildTheHtmlOutput += '<fieldset>';
        buildTheHtmlOutput += '<label for="habit-name">Habit title</label>';
        buildTheHtmlOutput += '<input type="text" class="habit-name" placeholder="Name for a Habit" value="' + resultValue.habitName + '">';
        buildTheHtmlOutput += '<div class="select-day">';
        buildTheHtmlOutput += '<span>I want to repeat this</span>';
        if (resultValue.weekday == 'monday') {
            buildTheHtmlOutput += '<input type="radio" name="day" class="monday" value="monday" checked>';
            buildTheHtmlOutput += '<label for="monday">Mon</label>';
        } else {
            buildTheHtmlOutput += '<input type="radio" name="day" class="monday" value="monday">';
            buildTheHtmlOutput += '<label for="monday">Mon</label>';
        }
        if (resultValue.weekday == 'tuesday') {
            buildTheHtmlOutput += '<input type="radio" name="day" class="tuesday" value="tuesday" checked>';
            buildTheHtmlOutput += '<label for="tuesday">Tue</label>';
        } else {
            buildTheHtmlOutput += '<input type="radio" name="day" class="tuesday" value="tuesday">';
            buildTheHtmlOutput += '<label for="tuesday">Tue</label>';
        }
        if (resultValue.weekday == 'wednesday') {
            buildTheHtmlOutput += '<input type="radio" name="day" class="wednesday" value="wednesday" checked>';
            buildTheHtmlOutput += '<label for="wednesday">Wed</label>';
        } else {
            buildTheHtmlOutput += '<input type="radio" name="day" class="wednesday" value="wednesday">';
            buildTheHtmlOutput += '<label for="wednesday">Wed</label>';
        }
        if (resultValue.weekday == 'thursday') {
            buildTheHtmlOutput += '<input type="radio" name="day" class="thursday" value="thursday" checked>';
            buildTheHtmlOutput += '<label for="thursday">Thu</label>';
        } else {
            buildTheHtmlOutput += '<input type="radio" name="day" class="thursday" value="thursday">';
            buildTheHtmlOutput += '<label for="thursday">Thu</label>';
        }
        if (resultValue.weekday == 'friday') {
            buildTheHtmlOutput += '<input type="radio" name="day" class="friday" value="friday" checked>';
            buildTheHtmlOutput += '<label for="friday">Fri</label>';
        } else {
            buildTheHtmlOutput += '<input type="radio" name="day" class="friday" value="friday">';
            buildTheHtmlOutput += '<label for="friday">Fri</label>';
        }
        if (resultValue.weekday == 'saturday') {
            buildTheHtmlOutput += '<input type="radio" name="day" class="saturday" value="saturday" checked>';
            buildTheHtmlOutput += '<label for="saturday">Sat</label>';
        } else {
            buildTheHtmlOutput += '<input type="radio" name="day" class="saturday" value="saturday">';
            buildTheHtmlOutput += '<label for="saturday">Sat</label>';
        }
        if (resultValue.weekday == 'sunday') {
            buildTheHtmlOutput += '<input type="radio" name="day" class="sunday" value="sunday" checked>';
            buildTheHtmlOutput += '<label for="sunday">Sun</label>';
        } else {
            buildTheHtmlOutput += '<input type="radio" name="day" class="sunday" value="sunday">';
            buildTheHtmlOutput += '<label for="sunday">Sun</label>';
        }

        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '<div class="select-daytime">';
        buildTheHtmlOutput += '<span>I will do it</span>';
        buildTheHtmlOutput += '<select name="daytime" class="habit-time">';
        if (resultValue.time == 'anytime') {
            buildTheHtmlOutput += '<option value="anytime" selected>At any time of the day</option>';
        } else {
            buildTheHtmlOutput += '<option value="anytime">At any time of the day</option>';
        }
        if (resultValue.time == 'morning') {
            buildTheHtmlOutput += '<option value="morning" selected>In the morning</option>';
        } else {
            buildTheHtmlOutput += '<option value="morning">In the morning</option>';
        }
        if (resultValue.time == 'afternoon') {
            buildTheHtmlOutput += '<option value="afternoon" selected>In the afternoon</option>';
        } else {
            buildTheHtmlOutput += '<option value="afternoon">In the afternoon</option>';
        }
        if (resultValue.time == 'evening') {
            buildTheHtmlOutput += '<option value="evening" selected>In the evening</option>';
        } else {
            buildTheHtmlOutput += '<option value="evening">In the evening</option>';
        }

        buildTheHtmlOutput += '</select>';
        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '</fieldset>';
        buildTheHtmlOutput += '<button type="submit" class="habit-form-done">Done</button>';
        buildTheHtmlOutput += '<button type="button" class="habit-form-cancel" onclick="hideHabitFormContainer(\'' + resultValue._id + '\')">Cancel</button>';
        buildTheHtmlOutput += '</form>';
        buildTheHtmlOutput += '</div>';
        // End Habit Edit form
        buildTheHtmlOutput += '</div>';

    });

    //use the HTML output to show it in the index.html
    $(".habit-container-wrapper").html(buildTheHtmlOutput);

}

// Get Notes content from DB by Habit Id
function populateNotesByHabitId(habitId) {
    $.ajax({
            type: 'GET',
            url: `/get-notes/${habitId}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function (result) {
            //console.log("get notes result done function", result);
            displayNotes(result, habitId);
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayNotes(result, habitId) {
    let buildTheHtmlOutput = "";

    $.each(result, function (resultKey, resultValue) {
        //notes container start
        buildTheHtmlOutput += '<div class="habit-notes" id="habit-notes-js">';
        buildTheHtmlOutput += '<div class="notes-handle">';
        buildTheHtmlOutput += '<span>Notes & Journal</span>';
        buildTheHtmlOutput += '<input type="hidden" class="save-note-id" value="' + resultValue._id + '">';
        buildTheHtmlOutput += '<button type="submit" class="notes-save notesSaveJs"><i class="far fa-save"></i></button>';
        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '<div contenteditable class="notes-content-js">' + resultValue.notesContent;
        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '</div>';
        //notes container stop
    });

    //use the HTML output to show it in the index.html
    $(".notes-container." + habitId).html(buildTheHtmlOutput);
}

// Edit habit option
function editHabit(habitId) {
    //console.log($(this).parent());
    $('#' + habitId).show();
}

// Delete habit by habit Id
function deleteHabit(habitID, username) {
    // Make a DELETE call to delete item by ID
    $.ajax({
            type: 'DELETE',
            url: `/habit/${habitID}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            //console.log(result);
            populateHabitsByUsername(username);
            alert("Habit will be deleted");
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

}

// Checkin habit by habit ID
function checkinHabit(habitId) {
    //console.log(habitId);

    // Create a payload to update the checked value in DB
    const habitObject = {
        habitId
    };
    console.log("habit to update", habitObject);
    //make the api call using the payload above
    $.ajax({
            type: 'PUT',
            url: '/habit/checkin',
            dataType: 'json',
            data: JSON.stringify(habitObject),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            //console.log(result);
            populateHabitsByUsername();
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Incorrect habit checkin updation');
        });
}

// Make a GET call to get the milestone items for the habit
function populateMilestoneItemsByHabitId(habitId) {
    $.ajax({
            type: 'GET',
            url: `/get-milestones/${habitId}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function (result) {
            //console.log("get milestones result done function", result);
            displayMilestones(result, habitId);
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayMilestones(result, habitId) {
    let buildTheHtmlOutput = "";

    //milestone container start
    buildTheHtmlOutput += '<div class="habit-milestones" id="habit-milestones-js">';
    buildTheHtmlOutput += '<div class="milestone-list">';
    buildTheHtmlOutput += '<div class="milestones-header">';
    buildTheHtmlOutput += '<label for="milestoneInput" class="milestone-title">Milestones</label>';
    buildTheHtmlOutput += '<input type="text" class="milestoneInput" placeholder="Enter title..." required>';
    buildTheHtmlOutput += '<button type="submit" class="milestone-add-button" id="milestone-item-add-js"><i class="fa fa-plus" aria-hidden="true"></i></button>';
    buildTheHtmlOutput += '</div>';
    buildTheHtmlOutput += '<ul id="milestonesItems">';

    $.each(result, function (resultKey, resultValue) {
        buildTheHtmlOutput += '<li>';
        console.log(resultValue.checked);
        if (resultValue.checked == 'true') {
            buildTheHtmlOutput += '<input type="checkbox" class="milestone-item" checked>';
        } else {
            buildTheHtmlOutput += '<input type="checkbox" class="milestone-item">';
        }
        buildTheHtmlOutput += '<input type="hidden" class="save-milestone-id" value="' + resultValue._id + '">';
        buildTheHtmlOutput += '<label for="milestone-item">';
        buildTheHtmlOutput += resultValue.milestonesContent;
        buildTheHtmlOutput += '</label>';
        buildTheHtmlOutput += '<button class="delete-milestone-item"><i class="fas fa-times"></i></button>';
        buildTheHtmlOutput += '</li>';
    });

    buildTheHtmlOutput += '</ul>';
    buildTheHtmlOutput += '</div>';
    buildTheHtmlOutput += '</div>';
    //milestone container stop

    //use the HTML output to show it in the index.html
    $(".milestone-container." + habitId).html(buildTheHtmlOutput);
}


function hideHabitFormContainer(habitId) {
    $('#' + habitId).hide();
    //alert("Cancel button clicked");
}

$(document).ready(function () {
    //    $('main').hide();
    $('main').show();
    $('#nav-bar').show();
    $('#navbar-logout-js').hide();
    $('#landing-screen').show();
    $('#footer-container').show();
    //habit container - checkin
    //$('#checkin-habit-js').on('click', function (event) {
    //    event.preventDefault();
    //      alert("habit checkin icon clicked");
    //});
    $(".newuser-msg").hide();
});

// Signup button on landing screen(hero)
$(document).on('click', '#hero-signup-button-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#nav-bar').addClass('nav-background');
    $('.nav-left li, .nav-right li').css('color', 'white');
    $('#signup-screen').show();
    $('#footer-container').show();
});

//login button on landing screen(hero)
$(document).on('click', '#hero-login-button-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#nav-bar').addClass('nav-background');
    $('.nav-left li, .nav-right li').css('color', 'white');
    $('#footer-container').show();
    $('#login-screen').show();
});

//Login button at Nav bar
$(document).on('click', '#navbar-login-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#nav-bar').addClass('nav-background');
    $('.nav-left li, .nav-right li').css('color', 'white');
    $('#footer-container').show();
    $('#login-screen').show();
});

// login button at signup form
$(document).on('click', '#singup-screen-login-button-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#nav-bar').addClass('nav-background');
    $('.nav-left li, .nav-right li').css('color', 'white');
    $('#footer-container').show();
    $('#login-screen').show();
});

// signup button at login form
$(document).on('click', '#login-screen-signup-button-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#nav-bar').addClass('nav-background');
    $('.nav-left li, .nav-right li').css('color', 'white');
    $('#footer-container').show();
    $('#signup-screen').show();
});

//Signup button at signup form
$(document).on('click', '#signup-button-js', function (event) {
    event.preventDefault();
    // get values from sign up form
    const username = $('#signup-username').val();
    const password = $('#signup-password').val();
    const confirmPassword = $('#signup-confirm-password').val();

    // validate user inputs
    if (username == '')
        alert('Must input username');
    else if (password == '')
        alert('Must input password');
    else if (confirmPassword == '')
        alert('Must re-enter password');
    else if (password != confirmPassword)
        alert('Passwords do not match');
    // if valid
    else {
        // create the payload object (what data we send to the api call)
        const newUserObject = {
            username: username,
            password: password
        };
        // make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/create',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            // if call is succefull
            .done(function (result) {
                console.log(result);
                $('#loggedin-user').val(result.username);
                $('#nav-bar span').text("Hello " + result.username);
                $('main').hide();
                $('#nav-bar').show();
                $('#nav-bar').addClass('nav-background');
                $('.nav-left li, .nav-right li').css('color', 'white');
                $('#footer-container').show();
                $('#dashboard-js').show();
                $('#navbar-login-js').hide();
                $('#navbar-logout-js').show();
                $(".newuser-msg").show();
                $('.habit-edit-screen').hide();
                populateHabitsByUsername(result.username);
            })
            // if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
});

// Login button at Login form
$(document).on('click', '#login-button-js', function (event) {
    event.preventDefault();

    // Get the inputs from the user in Log In form
    const username = $("#login-username").val();
    const password = $("#login-password").val();

    // validate the input
    if (username == "") {
        alert('Please input user name');
    } else if (password == "") {
        alert('Please input password');
    }
    // if the input is valid
    else {
        // create the payload object (what data we send to the api call)
        const loginUserObject = {
            username: username,
            password: password
        };
        console.log(loginUserObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                //console.log(result);
                $('#loggedin-user').val(result.username);
                $('#nav-bar span').text("Hello " + result.username);

                populateHabitsByUsername(result.username);

                $('main').hide();
                $('#nav-bar').show();
                $('#nav-bar').addClass('nav-background');
                $('.nav-left li, .nav-right li').css('color', 'white');
                $('#navbar-login-js').hide();
                $('#navbar-logout-js').show();
                $('#footer-container').show();
                $('#dashboard-js').show();
                $('.habit-edit-screen').hide();
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Incorrect Username or Password');
            });
    };
});

// user dashboard - add habit button
$(document).on('click', '#add-habit-button-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#nav-bar').addClass('nav-background');
    $('#footer-container').show();
    $('#habit-add-screen').show();
});

//habit container - delete habit
$('#delete-habit-js').on('click', function (event) {
    event.preventDefault();
    $('#habit-container-js').hide();

    // Get values of habit name and logged in user
    //const habitName = $(".habit-name").val();
    //const loggedinUser = $('#loggedin-user').val();
});

// habit  form done button
$(document).on('click', '#habit-form-done-js', function (event) {
    event.preventDefault();

    // Get the inputs from the user in Log In form
    const habitName = $("#habit-name").val();
    const weekday = $("input[type='radio']:checked").val();
    const time = $('#habit-time').val();

    const loggedinUser = $('#loggedin-user').val();

    // validate the input
    if (habitName == "") {
        alert('Please input habit name');
    } else if (weekday == "") {
        alert('Please select the weekday');
    } else if (time == '') {
        alert('Please select the time');
    }
    // if the input is valid
    else {
        // create the payload object (what data we send to the api call)
        const newHabitObject = {
            habitName: habitName,
            weekday: weekday,
            time: time,
            loggedinUser: loggedinUser
        };

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/habit/create',
                dataType: 'json',
                data: JSON.stringify(newHabitObject),
                contentType: 'application/json'
            })
            //if call is successfull
            .done(function (result) {
                console.log(result);
                $('#habit-add-screen').hide();
                $('#dashboard-js').show();
                populateHabitsByUsername(result.loggedinUser);

                $('html, body').animate({
                    scrollTop: $('footer').offset().top
                }, 1200);

            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Incorrect New habit object');
            });
    };
});

// Habit edit form submit
$(document).on('submit', '.habit-edit-form', function (event) {
    event.preventDefault();

    // Get the inputs from the user in Log In form
    const habitName = $(this).find(".habit-name").val();
    const weekday = $(this).find("input[type='radio']:checked").val();
    const time = $(this).find('.habit-time').val();
    const habitId = $(this).closest('.habit-container').find('.noteMilestoneContainerID').val();
    const loggedinUser = $('#loggedin-user').val();
    //console.log(habitName, weekday, time, habitId, loggedinUser);

    // validate the input
    if (habitName == "") {
        alert('Please input habit name');
    } else if (weekday == "") {
        alert('Please select the weekday');
    } else if (time == '') {
        alert('Please select the time');
    }
    // if the input is valid
    else {
        // create the payload object (what data we send to the api call)
        const editHabitObject = {
            habitName: habitName,
            weekday: weekday,
            time: time,
            loggedinUser: loggedinUser
        };

        //make the api call using the payload above
        $.ajax({
                type: 'PUT',
                url: `/update-habit/${habitId}`,
                dataType: 'json',
                data: JSON.stringify(editHabitObject),
                contentType: 'application/json'
            })
            //if call is successfull
            .done(function (result) {
                console.log(result);
                populateHabitsByUsername(loggedinUser);
                $('.habit-edit-form').hide();
                alert('Habit is updated');
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Incorrect New habit object');
            });
    };

});

// habit  form cancel button
$(document).on('click', '#habit-form-cancel-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#habit-add-screen').hide();
    $('#dashboard-js').show();
});

// Notes save
$(document).on('click', '.notesSaveJs', function (event) {
    event.preventDefault();

    // Get the value from the notes container
    let notesContent = $(this).parent().parent().find('.notes-content-js').html();
    let habitID = $(this).parent().parent().parent().parent().find('.noteMilestoneContainerID').val();

    if (notesContent == "") {
        notesContent = "Type here...";
    }
    let notesID = $(this).parent().find('.save-note-id').val();

    // create the payload object (what data we send to the api call)
    const notesObject = {
        notesContent,
        notesID,
        habitID
    };
    console.log("notes object initialized", notesObject);

    //make the api call using the payload above
    $.ajax({
            type: 'PUT',
            url: '/notes/save',
            dataType: 'json',
            data: JSON.stringify(notesObject),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            //                $('#habit-add-screen').hide();
            alert("Notes saved");
            populateNotesByHabitId(habitID);
            $('#dashboard-js').show();
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Incorrect Notes');
        });
});


// Adding an item in Milestones list habitId(unique) instead of Habit name(not unique)-- ??
$(document).on('click', '#milestone-item-add-js', function (event) {
    event.preventDefault();

    // Get the value from the milestone item input
    const milestonesContent = $(this).parent().find('.milestoneInput').val();

    // Get the user name
    const loggedinUser = $(this).parents().find('#loggedin-user').val();

    // Get the habit name associated with the milestones
    const habitName = $(this).parent().parent().parent().parent().parent().parent().find('.habit-title h4').html();

    // Get the Habit ID
    const habitID = $(this).parent().parent().parent().parent().parent().parent().find('.noteMilestoneContainerID').val();

    console.log("milestonesContent-", milestonesContent, "habitName-", habitName, "loggedinUser-", loggedinUser, "habitID-", habitID);

    // validate
    if (milestonesContent == "") {
        alert("Input milestone title");
        //console.log($(this));
        $(this).parent().find('.milestoneInput').focus();
    } else {
        // create the payload object (what data we send to the api call)
        const milestonesObject = {
            milestonesContent: milestonesContent,
            loggedinUser: loggedinUser,
            habitName: habitName,
            habitID
        };
        //console.log(milestonesObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/milestones/add',
                dataType: 'json',
                data: JSON.stringify(milestonesObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                //console.log(result);
                populateMilestoneItemsByHabitId(habitID);
                $('#dashboard-js').show();
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Incorrect milestone');
            });
    }
});

// Delete button on Milestones
$(document).on('click', '.delete-milestone-item', function (event) {
    event.preventDefault();

    // Get the clicked elemt and habit ID
    let milestoneID = $(this).parent().find('.save-milestone-id').val();
    let habitID = $(this).parent().parent().parent().parent().parent().parent().find('.noteMilestoneContainerID').val();

    $.ajax({
            type: 'DELETE',
            url: `/milestone/${milestoneID}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            console.log(result);
            populateMilestoneItemsByHabitId(habitID);
            alert("Milestone item deleted");
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

});

// Milestone item check and uncheck
$(document).on('change', '.milestone-item', function (event) {
    const milestoneID = $(this).parent().find('.save-milestone-id').val();
    let habitID = $(this).parent().parent().parent().parent().parent().parent().find('.noteMilestoneContainerID').val();
    let checked;

    console.log("milestone id", milestoneID);
    // Set the checked varibale value based on user check/unchek
    if (this.checked) {
        checked = true;
        console.log("checked", checked);

    } else {
        checked = false;
        console.log("unchecked", checked);
    }

    // Create a payload to update the checked value in DB
    const milestoneObject = {
        milestoneID,
        checked
    };
    console.log("milestone to update", milestoneObject);
    //make the api call using the payload above
    $.ajax({
            type: 'PUT',
            url: '/milestone/check',
            dataType: 'json',
            data: JSON.stringify(milestoneObject),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            console.log(result);
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Incorrect Milestone updation');
        });
});

// Nav bar logout
$('#navbar-logout-js').click(function (event) {
    event.preventDefault();
    location.reload();
});
