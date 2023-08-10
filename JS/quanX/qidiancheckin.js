/**
 * @fileoverview Example to compose HTTP request
 * and handle the response.
 *
 */

const url = "https://magev6.if.qidian.com/argus/api/v2/checkin/checkin";
const method = "POST";
const headers = {"QDH": "6H2kDVrikf/Vimr6AjAZ1bNA/kBWIr2v7or351N+LSkHxTngvA0o5OFuoDmWDJjkTF+p/bUttP46FKemPZLnU3lMrcBjgqXlE4HAH42V3BEfBmYFGm2iVeLxrUCeDnHxQZCLjwsn0xx08bZCtF889ajCh0faAiPtC8xvr4UieQO6Ofrh+6AQ9O5EFrJ/d4jz6P21SdK96ZAcCWAdZ16tmnRQLvn4dLl/c1hKfmfCKF17HrLOKLCtUZTSnVDDMbQv9R2jjHbJYbt6LYqygW/0D8wgnYNaQiZWK37VjIh/jYpxLamzcjlI5xeF3E5o49x8J2FRuaNZ/pI="};
const data = {"info": "abc"};

const myRequest = {
    url: url,
    method: method, // Optional, default GET.
    headers: headers, // Optional.
    body: JSON.stringify(data) // Optional.
};

$task.fetch(myRequest).then(response => {
    // response.statusCode, response.headers, response.body
    console.log(response.body);
    $notify("Title", "Subtitle", response.body); // Success!
    $done();
}, reason => {
    // reason.error
    $notify("Title", "Subtitle", reason.error); // Error!
    $done();
});
