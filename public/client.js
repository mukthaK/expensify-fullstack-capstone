//Triggers

// to check if friend already been added
function checkFriend(friendsOutput, email) {
    console.log(friendsOutput);
    for (let i = 0; i < friendsOutput.length; i++) {
        if (friendsOutput[i].email === email) {
            return true;
        }
    }
    return false;
}

function addFriendToList(email) {
    const loggedinUser = $('#loggedin-user').val();

    // create the payload object (what data we send to the api call)
    const friendObject = {
        loggedinUser,
        email,
        //username
    };
    console.log(friendObject);
    // Check if friend already added
    $.ajax({
            type: 'GET',
            url: `/getfriends/${loggedinUser}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function (result) {
            console.log(result);
            let exists = checkFriend(result.friendsOutput, email);
            console.log(exists);
            // if exists message- already beedn added
            if (exists) {
                alert("Friend has alredy been added!");
            }
            // if not Add friend to the list (post call)
            else {
                //make the api call using the payload above
                $.ajax({
                        type: 'POST',
                        url: '/friend/add',
                        dataType: 'json',
                        data: JSON.stringify(friendObject),
                        contentType: 'application/json'
                    })
                    //if call is succefull
                    .done(function (result) {
                        console.log(result);
                        getFriends(loggedinUser);
                        //$('#dashboard-js').show();
                    })
                    //if the call is failing
                    .fail(function (jqXHR, error, errorThrown) {
                        console.log(jqXHR);
                        console.log(error);
                        console.log(errorThrown);
                        alert('Incorrect friend');
                    });
            }
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });


}

function getFriends(loggedinUser) {
    //const loggedinUser = $('#loggedin-user').val();
    //make the api call to get habits by username
    $.ajax({
            type: 'GET',
            url: `/getfriends/${loggedinUser}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function (result) {
            console.log(result);
            displayFriend(result.friendsOutput);
            //$('.habit-edit-screen').hide();
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayFriend(friend) {

    let buildTheHtmlOutput = "";

    $.each(friend, function (friendKey, friendValue) {
        console.log(friendKey, friendValue);
        buildTheHtmlOutput += '<div class="friend">';
        buildTheHtmlOutput += `<span>${friendValue.email}</span>`;
        //        buildTheHtmlOutput += '<button role="button" type="submit" class="friend-delete">&times;</button>';
        buildTheHtmlOutput += '</div>';
    });
    $('.friends-list').html(buildTheHtmlOutput);
}

//function getUniqueValue(result, flag) {
    //get unique psidBy users
    //    let paidByUsers = [...new Set(result.map(item => item.paidBy))];
    //
    //    console.log(paidByUsers);

    let temp = {};
    let obj = null;
    for (let i = 0; i < result.length; i++) {
        obj = result[i];
        if (flag == "youowe") {
            if (!temp[obj.paidBy]) {
                temp[obj.paidBy] = obj;
                console.log(temp[obj.paidBy]);
            } else {
                temp[obj.paidBy].amount += obj.amount;
                //console.log(temp[obj.paidBy].amount, "amount -n");
            }

        } else if (flag == "owed") {
            if (!temp[obj.paidTo]) {
                temp[obj.paidTo] = obj;
            } else {
                temp[obj.paidTo].amount += obj.amount;
            }
            console.log(obj.amount, "debug");
        }
    }
    let billResult = [];
    for (let prop in temp)
        billResult.push(temp[prop]);
    console.log(billResult);

    return billResult;
}

//function populateDescriptionResults(paidBy, loggedinUser) {

}

function main_calculation(result) {
    const user = $('#loggedin-user').val();
    //Since we know the user logged in:
    let ppl_i_owe = [];
    let ppl_owe_me = [];
    let final_output = [];

    let others = [];
    for (i = 0; i < result.length; i++) {
        others[i] = (Object.values(result[i])[4]);
    }
    var unique_others = Array.from(new Set(others));
    console.log("People expecting money from:", unique_others);


    //User has to get money
    //let get_money[];
    for (k = 0; k < unique_others.length; k++) {
        paid_to = unique_others[k];
        final_value = 0;
        //console.log("running for",user);
        //Loop through all the objects
        for (i = 0; i < result.length; i++) {
            //If user is same as the user in that object, then add to the //final amount
            if (((Object.values(result[i])[3]) == user) & ((Object.values(result[i])[4]) == paid_to)) {
                final_value += (Object.values(result[i])[2]);
            }
        }
        //console.log(final_value, user, paid_to);
        temp = {
            user: user,
            paid_to: paid_to,
            amount: final_value
        }
        ppl_owe_me.push(temp)
    }
    console.log("PPL who owe me are :", ppl_owe_me);

    //User has to pay money.
    let others_2 = [];
    for (i = 0; i < result.length; i++) {
        others_2[i] = (Object.values(result[i])[3]);
    }
    var unique_others_2 = Array.from(new Set(others_2));
    //console.log("People to pay money to:",unique_others_2);


    //User has to get money
    for (k = 0; k < unique_others_2.length; k++) {
        paid_by = unique_others_2[k];
        final_value = 0;
        //console.log("running for",user);
        //Loop through all the objects
        for (i = 0; i < result.length; i++) {
            //If user is same as the user in that object, then add to the //final amount
            if (((Object.values(result[i])[4]) == user) & ((Object.values(result[i])[3]) == paid_by)) {
                final_value += (Object.values(result[i])[2]);
            }
        }
        //console.log(final_value, user, paid_by);
        temp1 = {
            user: user,
            paid_by: paid_by,
            amount: final_value
        }
        ppl_i_owe.push(temp1);

    }
    console.log("PPL who I owe  are :", ppl_i_owe);

    //Finalizing the calc
    for (i = 0; i < ppl_owe_me.length; i++) {
        //for each entry here, need to find same user and same payee in other DB
        for (j = 0; j < ppl_i_owe.length; j++) {
            if ((Object.values(ppl_owe_me[i])[1]) == (Object.values(ppl_i_owe[j])[1])) {
                //this means you owe and need to get money from same person
                temp3 = {
                    user1: user,
                    user2: (Object.values(ppl_i_owe[j])[1]),
                    amount: (Object.values(ppl_owe_me[i])[2]) - (Object.values(ppl_i_owe[j])[2])
                }
                value1 = (Object.values(ppl_owe_me[i])[2]);
                value2 = (Object.values(ppl_i_owe[j])[2]);
                //console.log(value1, value2);
                final_output.push(temp3);
            }
        }

    }
    console.log("FINAL", final_output);

    return final_output;
}

//**
//function to get bills that I owe
function getBillsYouOwe() {
    const loggedinUser = $('#loggedin-user').val();
    $.ajax({
            type: 'GET',
            url: `/bill/${loggedinUser}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function (result) {
            console.log(result);
            let billSummary = main_calculation(result);
            let buildTheHtmlOutput = "";
            $.each(billSummary, function (billKey, billValue) {
                if (billValue.amount > 0) {
                    buildTheHtmlOutput += `<div class="panel">`;
                    buildTheHtmlOutput += `<p>Owes you</p>`;
                    buildTheHtmlOutput += `<h4>${billValue.user2}</h4>`;
                    buildTheHtmlOutput += '<input type="hidden" class="settleup-user" value="' + billValue.user2 + '">';
                    buildTheHtmlOutput += `<p>Total: $ ${(billValue.amount).toFixed(2)}</p>`;
                    buildTheHtmlOutput += `<button role="button" type="submit" id="settleup-js">Settle Up</button>`;
                    buildTheHtmlOutput += `</div>`;
                } else if (billValue.amount < 0) {
                    buildTheHtmlOutput += `<div class="panel">`;
                    buildTheHtmlOutput += `<p>You owe</p>`;
                    buildTheHtmlOutput += `<h4>${billValue.user2}</h4>`;
                    buildTheHtmlOutput += '<input type="hidden" class="settleup-user" value="' + billValue.user2 + '">';
                    buildTheHtmlOutput += `<p>Total: $ ${(-billValue.amount).toFixed(2)}</p>`;
                    buildTheHtmlOutput += `<button role="button" type="submit" id="settleup-js">Settle Up</button>`;
                    buildTheHtmlOutput += `</div>`;
                }
            });
            $('#youOweBills').html(buildTheHtmlOutput);
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

//function getBillsOwed() {
//    const loggedinUser = $('#loggedin-user').val();
//    $.ajax({
//            type: 'GET',
//            url: `/billowed/${loggedinUser}`,
//            dataType: 'json',
//            contentType: 'application/json'
//        })
//        //if call is successfull
//        .done(function (result) {
//            console.log(result);
//            let flag = "owed";
//            let billResult = getUniqueValue(result, flag);
//
//            let buildTheHtmlOutput = "";
//            //            let total = 0;
//            //            let oldValue = "";
//            //            let final_total = 0;
//            //populate drop down list with values
//            $.each(billResult, function (billKey, billValue) {
//
//                buildTheHtmlOutput += `<div class="panel">`;
//                buildTheHtmlOutput += `<h4>${billValue.paidTo}</h4>`;
//                buildTheHtmlOutput += `<p>Total: $ ${billValue.amount}</p>`;
//                buildTheHtmlOutput += `<button role="button" type="submit" id="settleup-js">Settle Up</button>`;
//                buildTheHtmlOutput += `</div>`;
//            });
//            $('#owedBills').html(buildTheHtmlOutput);
//        })
//        //if the call is failing
//        .fail(function (jqXHR, error, errorThrown) {
//            console.log(jqXHR);
//            console.log(error);
//            console.log(errorThrown);
//        });
//}

// **
$(document).ready(function () {
    $('main').show();
    $('#navbar').hide();
    $('.signup-form').hide();
    $('#friends').hide();
    $('#bill').hide();
    $('#youOwe').hide();
    $('#youAreOwed').hide();
    $('#activity').hide();
    $('#chgPswd').hide();
    $('#footer').show();
});

// **
// login button at signup form
$(document).on('click', '#login-signup-js', function (event) {
    event.preventDefault();
    $('.login-form').show();
    $('.signup-form').hide();
    //alert("login btn on signup clicked")
});

// **
// signup button at login form
$(document).on('click', '#signup-login-js', function (event) {
    event.preventDefault();
    $('.login-form').hide();
    $('.signup-form').show();
    //alert("signup btn on login clicked");
});

// ** ...
//Signup button at signup form
$(document).on('click', '#signup-js', function (event) {
    event.preventDefault();
    // get values from sign up form
    //const username = $('#signup-username').val();
    const email = $('#signup-email').val();
    const password = $('#signup-psw').val();

    // validate user inputs
    //    if (username == '')
    //        alert('Must input username');
    if (password == '')
        alert('Must input password');
    else if (email == '')
        alert('Must enter email');
    // if valid
    else {
        // create the payload object (what data we send to the api call)
        const newUserObject = {
            //username: username,
            email: email,
            password: password
        };
        console.log(newUserObject);
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
                $('main').hide();
                $('#navbar').show();
                //alert("signup clicked");
                $('#youOwe').show();

                console.log(result);
                $('#loggedin-user').val(result.email);
                getBillsYouOwe();
            })
            // if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
});

// ** ...
// Login button at Login form
$(document).on('click', '#login-js', function (event) {
    event.preventDefault();

    // Get the inputs from the user in Log In form
    const email = $("#login-email").val();
    const password = $("#login-psw").val();

    // validate the input
    if (email == "") {
        alert('Please input email');
    } else if (password == "") {
        alert('Please input password');
    }
    // if the input is valid
    else {
        // create the payload object (what data we send to the api call)
        const loginUserObject = {
            email: email,
            password: password
        };
        //        console.log(loginUserObject);
        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
            //            //if call is succefull
            .done(function (result) {
                $('main').hide();
                $('#navbar').show();
                //alert("login clicked");
                $('#youOwe').show();

                console.log(result);
                $('#loggedin-user').val(result.email);
                getBillsYouOwe();
            })
            //            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Incorrect Username or Password');
            });
    }
});

// **
// user dashboard - click on friend link
$(document).on('click', '#friends-js', function (event) {
    event.preventDefault();
    const loggedinUser = $('#loggedin-user').val();
    $('main').hide();
    $('#nav-bar').show();
    $('#friends').show();
    $('.invite').hide();
    getFriends(loggedinUser);
});

// **
// Bill link
$(document).on('click', '#bill-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#bill').show();
    const loggedinUser = $('#loggedin-user').val();

    $.ajax({
            type: 'GET',
            url: `/getfriends/${loggedinUser}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is successfull
        .done(function (result) {
            console.log(result);
            const friend = result.friendsOutput;
            let buildTheHtmlOutput = "";
            //populate drop down list with values
            $.each(friend, function (friendKey, friendValue) {
                console.log(friendKey, friendValue);
                buildTheHtmlOutput += `<option value="${friendValue.email}">${friendValue.email}</option>`;
            });

            $('#friendPaid').html(buildTheHtmlOutput);
            $('#friendPaid').append(`<option value="${loggedinUser}">${loggedinUser}</option>`);
            //populate checkboxed with value

            buildTheHtmlOutput = "";
            $.each(friend, function (friendKey, friendValue) {
                console.log(friendKey, friendValue);
                buildTheHtmlOutput += `<div class="friends-billed">`;
                buildTheHtmlOutput += `<label for="friend-name">${friendValue.email}</label>`;
                buildTheHtmlOutput += `<input type="checkbox" class="friend-name" name="paidFor" value="${friendValue.email}" required>`;
                buildTheHtmlOutput += `</div>`;
            });
            $('#paidForWrapper').html(buildTheHtmlOutput);
            $('#paidForWrapper').append(`<div class="friends-billed"><label for="friend-name">${loggedinUser}</label><input type="checkbox" class="friend-name" name="paidFor" value="${loggedinUser}" required></div>`);

        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

});

// Bill description --next btn
$(document).on('click', '#bill-submit', function (event) {
    event.preventDefault();

    const loggedinUser = $('#loggedin-user').val();
    const description = $('#description').val();
    const payment = $('#amount').val();
    const whoPaid = $('#friendPaid').val();
    const paidForArray = [];

    $("input[name='paidFor']:checked").each(function () {
        paidForArray.push($(this).val());
    })

    //console.log("description", description, "amount", amount, "whoPaid", whoPaid, "paidFor", paidForArray);

    if (description == "") {
        alert('Please enter description');
    } else if (amount == "") {
        alert('Please enter amount');
    } else if (whoPaid == "") {
        alert('Please select who paid the bill');
    } else if (paidForArray.length == 0) {
        alert("Please select atleast one checkbox option")
    } else {
        const amount = (payment / paidForArray.length).toFixed(2);
        paidForArray.forEach(function (friendPaidFor) {
            if (friendPaidFor !== whoPaid) {
                console.log(friendPaidFor);
                const newBillObject = {
                    description,
                    amount,
                    paidBy: whoPaid,
                    paidTo: friendPaidFor,
                    //date: new Date(),
                    //loggedinUser: loggedinUser
                };
                console.log(newBillObject);

                //make the api call using the payload above
                $.ajax({
                        type: 'POST',
                        url: '/bill/create',
                        dataType: 'json',
                        data: JSON.stringify(newBillObject),
                        contentType: 'application/json'
                    })
                    .done(function (result) {
                        console.log(result);
                        alert("Bill added");
                        var frm = document.getElementsByClassName('bill-form')[0];
                        frm.reset();
                    })
                    .fail(function (jqXHR, error, errorThrown) {
                        console.log(jqXHR);
                        console.log(error);
                        console.log(errorThrown);
                        alert('Incorrect bill');
                    });
            }
        });
    }
})

// **
// YouOwe link
$(document).on('click', '#youOwe-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#youOwe').show();
    getBillsYouOwe();
});

$(document).on('click', '#settleup-js', function (event) {
    event.preventDefault();
    //alert('settleup clicked');
    const loggedinUser = $('#loggedin-user').val();
    const user = $(this).parent().find('.settleup-user').val();

    // Create a payload to update the bill value in DB
    const billSettleupObject = {
        loggedinUser,
        user
    };
    console.log("bill settleup to update", billSettleupObject);
    //make the api call using the payload above
    $.ajax({
            type: 'PUT',
            url: '/bill/settleup',
            dataType: 'json',
            data: JSON.stringify(billSettleupObject),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            getBillsYouOwe();
            alert("bill settled");
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Settleup Error');
        });
});

// **
// youAreOwed link
$(document).on('click', '#youAreOwed-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#youAreOwed').show();

    getBillsOwed();
});

// **
// activity link
$(document).on('click', '#activity-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#activity').show();
});

// **
// chgPswd link
$(document).on('click', '#chgPswd-js', function (event) {
    event.preventDefault();
    $('main').hide();
    $('#nav-bar').show();
    $('#chgPswd').show();
});

//// **
// add friend
$(document).on('click', '#add-friend-js', function (event) {
    event.preventDefault();
    //alert("add friend clicked");
    // Get the inputs from the user in add friend form
    //const name = $("#friend-name").val();
    //    const email = $("input[type='radio']:checked").val();
    const email = $('#friend-email').val();

    const loggedinUser = $('#loggedin-user').val();

    console.log("add friend: ", name, email, loggedinUser);
    // validate the input
    //    if (name == "") {
    //        alert('Please enter  name');
    //    } else
    if (email == "") {
        alert('Please enter email');
    }
    // if the input is valid
    else {
        $('#save-friend-email').val(email);

        //make the api call to check if friend is a user of app
        $.ajax({
                type: 'GET',
                url: `/friend/${email}`,
                dataType: 'json',
                contentType: 'application/json'
            })
            //if call is successfull
            .done(function (result) {
                console.log("friend check", result);
                // if no frind returned
                if (result.length === 0) {
                    //display message - want to invite friend?
                    $('.invite').show();
                } // if friend found
                else {
                    // add friend to list
                    addFriendToList(result[0].email);
                    // show friend on dashboard
                    getFriends(loggedinUser);
                }
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Incorrect New friend object');
            });
    }
});
//  friend invite yes click
$(document).on('click', '#invite-js', function (event) {
    event.preventDefault();
    //alert("invite accepted");
    let email = $(this).parent().parent().find('#save-friend-email').val();
    let loggedinUser = $('#loggedin-user').val();
    console.log(" friend email", email, " loggedin user", loggedinUser);
    //// if yes -> make post call with all the details to create new user
    // create the payload object (what data we send to the api call)
    const newFriendObject = {
        //name: name,
        email: email,
        loggedinUser: loggedinUser
    };
    console.log(newFriendObject);

    //make the api call using the payload above
    $.ajax({
            type: 'POST',
            url: '/friend/create',
            dataType: 'json',
            data: JSON.stringify(newFriendObject),
            contentType: 'application/json'
        })
        .done(function (result) {
            console.log(result);
            $('.invite').hide();
            // add friend to list
            addFriendToList(result.email);
            //display in user friend dashboard
            console.log(loggedinUser);
            getFriends(loggedinUser);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Incorrect new friend');
        });
});

// friend invite no click
$(document).on('click', '#invite-cancel-js', function (event) {
    event.preventDefault();
    //alert("invite cancelled");
    $('.invite').hide();
});

// Update password form
$(document).on('submit', '.chgPswd-form', function (event) {
    event.preventDefault();
    const loggedinUser = $('#loggedin-user').val();
    const pw = $('#old-psw').val();
    const pw2 = $('#new-psw').val();
    if (pw !== pw2) {
        alert('Passwords do not match, please re-enter password');
    } else if (pw == "") {
        alert('Please enter old password');
    } else if (pw2 == "") {
        alert('Please enter new password');
    } else {
        const updateUserObject = {
            pw
        };
        $.ajax({
                type: 'PUT',
                url: `/update-password/${loggedinUser}`,
                dataType: 'json',
                data: JSON.stringify(updateUserObject),
                contentType: 'application/json'
            })
            .done(function (res) {
                $('#loggedin-user').val(res.email);
                alert("Password successfully updated");
                $('#chgPswd').show();
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
});

//  logout
$(document).on('click', '#logout-js', function (event) {
    event.preventDefault();
    location.reload();
});
