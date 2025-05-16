exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send({ message: "Usuário não encontrado" });

    await user.update(req.body);
    res.send({ message: "Perfil atualizado com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};