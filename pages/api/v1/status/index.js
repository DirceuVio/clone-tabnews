function status(request, response) {
  response.status(200).json({ message: "Eu amo minha esposa" });
}

export default status;
