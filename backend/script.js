const socket = io();
const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

const localVideo = document.getElementById("local");
const remoteVideo = document.getElementById("remote");

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localVideo.srcObject = stream;
        stream.getTracks().forEach(t => pc.addTrack(t, stream));
    });

pc.onicecandidate = e => {
    if (e.candidate) socket.emit("ice", e.candidate);
};

pc.ontrack = e => {
    remoteVideo.srcObject = e.streams[0];
};

socket.on("offer", async offer => {
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    if (answer)
        console.log(answer)
    await pc.setLocalDescription(answer);

});

socket.on("answer", async fanswer => {
    await pc.setRemoteDescription(answer);
});

socket.on("ice", async ice => {
    try { await pc.addIceCandidate(ice); } catch (err) { }
});
const socket = io();
let roomId = null;

function joinRoom() {
    roomId = document.getElementById("roomInput").value;
    socket.emit("join", roomId);
    startCall();
}

const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        document.getElementById("local").srcObject = stream;
        stream.getTracks().forEach(t => pc.addTrack(t, stream));
    });

pc.onicecandidate = e => {
    if (e.candidate) {
        socket.emit("ice", { roomId, candidate: e.candidate });
    }
};

pc.ontrack = e => {
    document.getElementById("remote").srcObject = e.streams[0];
};

socket.on("offer", async offer => {
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", { roomId, answer });
});

socket.on("answer", async answer => {
    await pc.setRemoteDescription(answer);
});

socket.on("ice", async candidate => {
    try { await pc.addIceCandidate(candidate); } catch (err) { }
});

async function startCall() {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", offer);
}

startCall();


