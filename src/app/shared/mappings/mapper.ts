import { createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';

const mapper = createMapper({
    strategyInitializer: classes(),
});

export default mapper;