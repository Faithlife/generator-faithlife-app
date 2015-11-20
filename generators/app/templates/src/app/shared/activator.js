export function activate({ components }, activationArgs) {
	return Promise.all(components.map(c => {
		if (c.activate) {
			return c.activate(...activationArgs);
		} else if (c.WrappedComponent && c.WrappedComponent.activate) {
			return c.WrappedComponent.activate(...activationArgs);
		}
	}));
}
