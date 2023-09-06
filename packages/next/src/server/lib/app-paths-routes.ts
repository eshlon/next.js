export type AppPathRoute = {
  readonly page: string
  readonly pathname: string
  readonly appPaths: ReadonlyArray<string>
}

export class AppPathsRoutes {
  private readonly appPaths = new Map<string, string[]>()

  /**
   * Add the given page to the app paths for the given pathname.
   *
   * @param pathname the pathname to add the page to
   * @param page the page to add to the pathname
   * @returns the number of app paths for the given pathname
   */
  public add(pathname: string, page: string): number {
    let appPaths = this.appPaths.get(pathname)
    if (!appPaths) {
      appPaths = [page]
      this.appPaths.set(pathname, appPaths)
    } else {
      appPaths.push(page)

      // Sort the app paths so that we can compare them with other app paths,
      // the order must be deterministic.
      appPaths.sort()
    }

    return appPaths.length
  }

  /**
   * Get the pathnames that have app paths, sorted.
   *
   * @returns the pathnames that have app paths
   */
  public pathnames(): ReadonlyArray<string> {
    return Array.from(this.appPaths.keys()).sort()
  }

  public get(pathname: string): AppPathRoute | null {
    let appPaths = this.appPaths.get(pathname)
    if (!Array.isArray(appPaths)) return null

    return {
      page: appPaths[appPaths.length - 1],
      pathname,
      appPaths,
    }
  }

  /**
   * Get the entries of the app paths.
   *
   * @returns the entries of the app paths
   */
  public toSortedArray(): ReadonlyArray<AppPathRoute> {
    const arr: Array<AppPathRoute> = []
    for (const pathname of this.pathnames()) {
      // We know that this will always return a value because we only add
      // pathnames that have app paths.
      const appPaths = this.get(pathname)!

      arr.push(appPaths)
    }

    return arr
  }
}
