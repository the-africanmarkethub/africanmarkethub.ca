const triggerConfetti = () => {
    const end = Date.now() + 3000;
    const colors = ["#016134", "#00A85A", "#00A85A"];
    (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
};