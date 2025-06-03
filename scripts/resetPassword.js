// Script para resetear la contraseña de un usuario específico usando TypeORM y bcrypt

const bcrypt = require('bcryptjs');
const { AppDataSource } = require('../backend/src/config/data-source');
const { Cliente } = require('../backend/src/models/Cliente');

const NUEVA_PASSWORD = 'los3hermanos';
const USUARIO_ID = 22;

async function resetPassword() {
  try {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Cliente);
    const usuario = await repo.findOneBy({ id: USUARIO_ID });
    if (!usuario) {
      console.error('Usuario no encontrado');
      process.exit(1);
    }
    const hash = await bcrypt.hash(NUEVA_PASSWORD, 10);
    usuario.password = hash;
    await repo.save(usuario);
    console.log('Contraseña actualizada correctamente para el usuario con ID', USUARIO_ID);
    process.exit(0);
  } catch (err) {
    console.error('Error al actualizar la contraseña:', err);
    process.exit(1);
  }
}

resetPassword();
